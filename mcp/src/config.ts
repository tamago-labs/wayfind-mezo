import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { randomBytes, pbkdf2Sync } from "crypto";
import sodium from "sodium-native";
import * as bip39 from "bip39";
import { Wallet } from "ethers";
import { BIP32Factory } from "bip32";
import * as tinysecp from "tiny-secp256k1";
import * as bitcoin from "bitcoinjs-lib";
import { networks } from "bitcoinjs-lib";

const WALLET_DIR = join(process.env.HOME || process.env.USERPROFILE || "", ".wayfind-mezo");
const WALLET_FILE = join(WALLET_DIR, ".wallet.json");
const MNEMONIC_FILE = join(WALLET_DIR, "REMOVE_AFTER_BACKUP.txt");

type Network = "testnet" | "mainnet";

const RPC_POOLS: Record<Network, Record<string, string[]>> = {
  testnet: {
    mezo: ["https://rpc.test.mezo.org"],
    ethereum: [
      "https://ethereum-sepolia-rpc.publicnode.com",
      "https://rpc.sepolia.org",
    ],
  },
  mainnet: {},
};

function pickRpc(urls: string[]): string {
  return urls[Math.floor(Math.random() * urls.length)];
}

export function getNetwork(): Network {
  const network = process.env.WAYFIND_NETWORK?.toLowerCase();
  if (network === "mainnet") {
    throw new Error("mainnet is not supported in v0.1, use testnet");
  }
  return "testnet";
}

export interface AppConfig {
  evmAddress: string;
  evmPrivateKey: string;
  btcAddress: string;
  seed: Buffer;
  evmRpcUrls: Record<string, string>;
}

interface StoredWallet {
  encryptedSeed: string;
  salt: string;
  evmAddress: string;
  btcAddress: string;
}

function deriveKeyFromPasskey(passkey: string, salt: Buffer): Buffer {
  return pbkdf2Sync(passkey, salt, 100_000, 32, "sha256");
}

function encryptBuffer(buffer: Buffer, key: Buffer): Buffer {
  if (buffer.byteLength < 16 || buffer.byteLength > 64) {
    throw new Error("Buffer size must be between 16 and 64");
  }

  const nonce = randomBytes(sodium.crypto_secretbox_NONCEBYTES);
  const plain = Buffer.alloc(1 + buffer.byteLength);
  plain[0] = buffer.byteLength;
  buffer.copy(plain, 1);

  const cipher = Buffer.alloc(plain.byteLength + sodium.crypto_secretbox_MACBYTES);
  sodium.crypto_secretbox_easy(cipher, plain, nonce, key);

  const payload = Buffer.alloc(1 + nonce.byteLength + cipher.byteLength);
  payload[0] = 0;
  nonce.copy(payload, 1);
  cipher.copy(payload, 1 + nonce.byteLength);

  return payload;
}

function decryptBuffer(payload: Buffer, key: Buffer): Buffer {
  const minLength = 1 + sodium.crypto_secretbox_NONCEBYTES + sodium.crypto_secretbox_MACBYTES + 1;
  if (payload.byteLength < minLength) {
    throw new Error("Invalid payload: too short");
  }
  if (payload[0] !== 0) {
    throw new Error("Invalid version");
  }

  const nonce = payload.subarray(1, 1 + sodium.crypto_secretbox_NONCEBYTES);
  const cipher = payload.subarray(1 + nonce.byteLength);

  const plain = Buffer.alloc(cipher.byteLength - sodium.crypto_secretbox_MACBYTES);
  if (!sodium.crypto_secretbox_open_easy(plain, cipher, nonce, key)) {
    throw new Error("Decryption failed");
  }

  const byteLength = plain[0];
  if (byteLength < 16 || byteLength > 64 || plain.byteLength < 1 + byteLength) {
    throw new Error("Invalid decrypted payload");
  }

  return Buffer.from(plain.subarray(1, 1 + byteLength));
}

function deriveKeysFromSeed(seed: Uint8Array) {
  const evmSeed = seed.slice(0, 32);
  const evmWallet = new Wallet(Buffer.from(evmSeed).toString("hex"));

  const bip32 = BIP32Factory(tinysecp);
  const bip32Root = bip32.fromSeed(Buffer.from(seed));
  const child = bip32Root.derivePath("m/44'/1'/0'/0/0");
  const { address } = bitcoin.payments.p2pkh({
    pubkey: Buffer.from(child.publicKey),
    network: networks.testnet,
  });

  return {
    evmAddress: evmWallet.address,
    evmPrivateKey: evmWallet.privateKey,
    btcAddress: address || "",
  };
}

async function loadOrCreateWalletKey(): Promise<{ seed: Uint8Array; mnemonic: string | null }> {
  if (existsSync(WALLET_FILE)) {
    const data: StoredWallet = JSON.parse(readFileSync(WALLET_FILE, "utf-8"));

    const passkey = process.env.WALLET_PASSKEY!;
    const salt = Buffer.from(data.salt, "base64");
    const key = deriveKeyFromPasskey(passkey, salt);
    const seed = decryptBuffer(Buffer.from(data.encryptedSeed, "base64"), key);

    return { seed: new Uint8Array(seed), mnemonic: null };
  }

  const randomEntropy = randomBytes(16);
  const mnemonic = bip39.entropyToMnemonic(randomEntropy.toString("hex"));
  const seed = bip39.mnemonicToSeedSync(mnemonic);

  const salt = randomBytes(16);
  const passkey = process.env.WALLET_PASSKEY!;
  const key = deriveKeyFromPasskey(passkey, salt);
  const encryptedSeed = encryptBuffer(Buffer.from(seed), key);

  sodium.sodium_memzero(key);

  const keys = deriveKeysFromSeed(new Uint8Array(seed));

  const stored: StoredWallet = {
    encryptedSeed: encryptedSeed.toString("base64"),
    salt: salt.toString("base64"),
    evmAddress: keys.evmAddress,
    btcAddress: keys.btcAddress,
  };

  if (!existsSync(WALLET_DIR)) {
    mkdirSync(WALLET_DIR, { recursive: true, mode: 0o700 });
  }
  writeFileSync(WALLET_FILE, JSON.stringify(stored, null, 2), { mode: 0o600 });
  writeFileSync(MNEMONIC_FILE, mnemonic, { mode: 0o600 });

  return { seed: new Uint8Array(seed), mnemonic };
}

export async function validateEnvironment(): Promise<AppConfig> {
  const passkey = process.env.WALLET_PASSKEY;
  if (!passkey) {
    throw new Error(
      "WALLET_PASSKEY environment variable is required.\n" +
      "Set it before running the MCP server.\n" +
      "Example: export WALLET_PASSKEY=\"your-secure-passphrase\""
    );
  }
  if (passkey.length < 12) {
    throw new Error("WALLET_PASSKEY must be at least 12 characters long.");
  }

  const { seed } = await loadOrCreateWalletKey();
  const keys = deriveKeysFromSeed(seed);

  process.on("exit", () => seed.fill(0));

  return {
    ...keys,
    seed: Buffer.from(seed),
    evmRpcUrls: Object.fromEntries(
      Object.entries(RPC_POOLS[getNetwork()]).map(([chain, urls]) => [chain, pickRpc(urls)])
    ),
  };
}
