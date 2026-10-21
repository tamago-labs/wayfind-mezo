import type { AppConfig } from "./config";
import { getNetwork } from "./config";
import { loadChainData, type ChainData } from "./utils/chain-data";

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
}
