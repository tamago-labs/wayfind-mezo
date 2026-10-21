#!/usr/bin/env node
/**
 * Wallet Recovery Script
 *
 * Usage:
 *   WALLET_PASSKEY="your-new-passphrase" npx tsx scripts/recover-wallet.ts "your mnemonic phrase here"
 *   WALLET_PASSKEY="your-new-passphrase" RECOVERY_MNEMONIC="your phrase" npx tsx scripts/recover-wallet.ts
 *
 * Output:
 *   .wallet.json (encrypted wallet)
 *   REMOVE_AFTER_BACKUP.txt (mnemonic backup)
 */

import { writeFileSync } from "fs";
import { join } from "path";
import { randomBytes, pbkdf2Sync } from "crypto";
import sodium from "sodium-native";
import * as bip39 from "bip39";
import { Wallet } from "ethers";
import { BIP32Factory } from "bip32";
import * as tinysecp from "tiny-secp256k1";
import * as bitcoin from "bitcoinjs-lib";
import { networks } from "bitcoinjs-lib";

const WALLET_DIR = process.cwd();
const WALLET_FILE = join(WALLET_DIR, ".wallet.json");
const MNEMONIC_FILE = join(WALLET_DIR, "REMOVE_AFTER_BACKUP.txt");

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

function deriveKeysFromSeed(seed: Buffer) {
  const evmSeed = seed.slice(0, 32);
  const evmWallet = new Wallet(evmSeed.toString("hex"));

  const bip32 = BIP32Factory(tinysecp);
  const root = bip32.fromSeed(seed);
  const child = root.derivePath("m/44'/1'/0'/0/0");
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

function main() {
  const mnemonic = process.argv[2] || process.env.RECOVERY_MNEMONIC;
  if (!mnemonic) {
    console.error("Usage: npx tsx recover-wallet.ts <mnemonic>");
    console.error("   or: RECOVERY_MNEMONIC=\"...\" npx tsx recover-wallet.ts");
    process.exit(1);
  }

  if (!bip39.validateMnemonic(mnemonic)) {
    console.error("Invalid mnemonic phrase.");
    process.exit(1);
  }

  const passkey = process.env.WALLET_PASSKEY;
  if (!passkey) {
    console.error("WALLET_PASSKEY environment variable is required.");
    process.exit(1);
  }
  if (passkey.length < 12) {
    console.error("WALLET_PASSKEY must be at least 12 characters long.");
    process.exit(1);
  }

  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const keys = deriveKeysFromSeed(seed);

  const salt = randomBytes(16);
  const key = deriveKeyFromPasskey(passkey, salt);
  const encryptedSeed = encryptBuffer(Buffer.from(seed), key);

  sodium.sodium_memzero(key);

  const stored = {
    encryptedSeed: encryptedSeed.toString("base64"),
    salt: salt.toString("base64"),
    evmAddress: keys.evmAddress,
    btcAddress: keys.btcAddress,
  };

  writeFileSync(WALLET_FILE, JSON.stringify(stored, null, 2), { mode: 0o600 });
  writeFileSync(MNEMONIC_FILE, mnemonic, { mode: 0o600 });

  console.log("Wallet recovered successfully!");
  console.log(`  EVM:  ${keys.evmAddress}`);
  console.log(`  BTC:  ${keys.btcAddress}`);
  console.log(`  File: ${WALLET_FILE}`);
}

main();
