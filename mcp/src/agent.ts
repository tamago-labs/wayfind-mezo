import type { AppConfig } from "./config";
import { getNetwork } from "./config";
import { loadChainData, type ChainData } from "./utils/chain-data";
import { getEvmBalances } from "./utils/evm-balance";
import { getBtcBalance } from "./utils/btc-balance";

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

    const chainData = this.chains.find((c) => c.chain === chain);
    if (!chainData) {
      throw new Error(`Unsupported chain: ${chain}. Supported: ${this.chains.map((c) => c.chain).join(", ")}, bitcoin`);
    }

    return getEvmBalances(
      chainData.rpcUrl,
      chainData.chainId,
      chainData.chain,
      chainData.nativeCurrency.symbol,
      chainData.tokens,
      addr
    );
  }
}
