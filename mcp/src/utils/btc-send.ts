import { BIP32Factory } from "bip32";
import * as tinysecp from "tiny-secp256k1";
import * as bitcoin from "bitcoinjs-lib";
import { networks } from "bitcoinjs-lib";

function getBitcoinNetwork() {
  return process.env.WAYFIND_NETWORK === "mainnet" ? networks.bitcoin : networks.testnet;
}

function seedToBtcKeys(seed: Buffer) {
  const bip32 = BIP32Factory(tinysecp);
  const root = bip32.fromSeed(seed);
  const child = root.derivePath("m/44'/1'/0'/0/0");
  const network = getBitcoinNetwork();
  const address = bitcoin.payments.p2pkh({
    pubkey: Buffer.from(child.publicKey),
    network,
  }).address!;
  return { privateKey: Buffer.from(child.privateKey!), publicKey: Buffer.from(child.publicKey), address };
}

async function fetchUtxos(address: string) {
  const res = await fetch(`https://blockstream.info/testnet/api/address/${address}/utxo`);
  if (!res.ok) throw new Error(`Failed to fetch UTXOs: ${res.status}`);
  return res.json() as Promise<Array<{ txid: string; vout: number; value: number }>>;
}

async function fetchTxHex(txid: string): Promise<string> {
  const res = await fetch(`https://blockstream.info/testnet/api/tx/${txid}/hex`);
  if (!res.ok) throw new Error(`Failed to fetch tx hex: ${res.status}`);
  return res.text();
}

async function broadcastTx(txHex: string): Promise<string> {
  const res = await fetch("https://blockstream.info/testnet/api/tx", {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: txHex,
  });
  if (!res.ok) throw new Error(`Broadcast failed: ${res.status} ${await res.text()}`);
  return res.text();
}

export async function sendBtc(seed: Buffer, recipient: string, amountSats: number) {
  const network = getBitcoinNetwork();
  const { privateKey, address: senderAddress } = seedToBtcKeys(seed);

  const utxos = await fetchUtxos(senderAddress);
  if (utxos.length === 0) throw new Error("No UTXOs available");

  const psbt = new bitcoin.Psbt({ network });
  let inputSum = 0;

  for (const utxo of utxos) {
    const txHex = await fetchTxHex(utxo.txid);
    psbt.addInput({
      hash: utxo.txid,
      index: utxo.vout,
      nonWitnessUtxo: Buffer.from(txHex, "hex"),
    });
    inputSum += utxo.value;
    if (inputSum >= amountSats) break;
  }

  if (inputSum < amountSats) {
    throw new Error(`Insufficient balance: have ${inputSum} sats, need ${amountSats}`);
  }

  psbt.addOutput({ address: recipient, value: amountSats });

  const estimatedFee = utxos.length * 180 + 2 * 50;
  const change = inputSum - amountSats - estimatedFee;
  if (change > 546) {
    psbt.addOutput({ address: senderAddress, value: change });
  }

  for (let i = 0; i < psbt.inputCount; i++) {
    psbt.signInput(i, {
      sign: (hash: Buffer) => {
        const signature = tinysecp.sign(hash, privateKey);
        return Buffer.from(bitcoin.script.signature.encode(Buffer.from(signature), bitcoin.Transaction.SIGHASH_ALL));
      },
      publicKey: Buffer.from(seedToBtcKeys(seed).publicKey),
    } as any);
  }

  psbt.finalizeAllInputs();

  const txHex = psbt.extractTransaction().toHex();
  const txid = await broadcastTx(txHex);

  return { txid, amount: amountSats, recipient, explorer: `https://blockstream.info/testnet/tx/${txid}` };
}
