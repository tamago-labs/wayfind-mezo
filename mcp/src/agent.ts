import { JsonRpcProvider, Wallet, Contract } from "ethers";
import type { AppConfig } from "./config";
import { getEvmBalances } from "./utils/evm-balance";
import { getBtcBalance } from "./utils/btc-balance";
import { sendBtc } from "./utils/btc-send";
import { sendEvmToken } from "./utils/evm-send";
import { loadChainData, type ChainData } from "./utils/chain-data";
import { getNetwork } from "./config";

export class Agent {
  public evmAddress: string;
  public btcAddress: string;
  private config: AppConfig;
  public chains: ChainData[];

  private constructor(config: AppConfig, chains: ChainData[]) {
    this.evmAddress = config.evmAddress;
    this.btcAddress = config.btcAddress;
    this.config = config;
    this.chains = chains;
  }



  static async create(config: AppConfig): Promise<Agent> {
    const chains = loadChainData(getNetwork());
    return new Agent(config, chains);
  }

  async getBalances(chain: string, walletAddress?: string) {
    const addr = walletAddress || this.evmAddress;

    if (chain === "bitcoin" || chain === "btc") {
      return getBtcBalance(this.btcAddress);
    }

    const rpcUrl = this.config.evmRpcUrls[chain];
    if (!rpcUrl) {
      throw new Error(`Unsupported chain: ${chain}. Supported: ${Object.keys(this.config.evmRpcUrls).join(", ")}, bitcoin`);
    }

    const chainData = this.chains.find((c) => c.chain === chain);
    if (!chainData) {
      throw new Error(`Chain config not found: ${chain}`);
    }

    return getEvmBalances(
      rpcUrl,
      chainData.chainId,
      chainData.chain,
      chainData.nativeCurrency.symbol,
      chainData.tokens,
      addr
    );
  }

  async getTransaction(chain: string, txHash: string) {
    const rpcUrl = this.config.evmRpcUrls[chain];
    if (!rpcUrl) {
      throw new Error(`Unsupported chain: ${chain}`);
    }

    const provider = new JsonRpcProvider(rpcUrl);
    const tx = await provider.getTransaction(txHash);
    const receipt = await provider.getTransactionReceipt(txHash);

    if (!tx) {
      return { chain, txHash, status: "not_found" };
    }

    if (!receipt) {
      return {
        chain,
        txHash,
        status: "pending",
        from: tx.from || "unknown",
        to: tx.to || "unknown",
      };
    }

    return {
      chain,
      txHash,
      status: receipt.status === 1 ? "confirmed" : "failed",
      blockNumber: receipt.blockNumber,
      from: receipt.from,
      to: receipt.to,
      value: tx.value.toString(),
      gasUsed: receipt.gasUsed.toString(),
    };
  }

  async sendTokens(input: { chain: string; token: string; amount: string; recipient: string }) {
    const chain = input.chain.toLowerCase();

    if (chain === "bitcoin" || chain === "btc") {
      if (input.token.toUpperCase() !== "BTC") {
        throw new Error("Bitcoin chain only supports BTC token");
      }
      return sendBtc(this.config.seed, input.recipient, BigInt(input.amount).toString());
    }

    const rpcUrl = this.config.evmRpcUrls[chain];
    if (!rpcUrl) {
      throw new Error(`Unsupported chain: ${chain}. Supported: ${Object.keys(this.config.evmRpcUrls).join(", ")}, bitcoin`);
    }

    const chainData = this.chains.find((c) => c.chain === chain);
    if (!chainData) {
      throw new Error(`Chain config not found: ${chain}`);
    }

    return sendEvmToken(
      this.config.evmPrivateKey,
      rpcUrl,
      chainData!,
      input.token,
      input.amount,
      input.recipient
    );
  }
}
