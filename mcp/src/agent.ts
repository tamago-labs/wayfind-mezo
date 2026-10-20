import { ethers } from "ethers";
import { loadArcConfig, type ArcConfig } from "./config";

export class Agent {
  public walletAddress: string;
  public config: ArcConfig;
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.Wallet;

  private constructor(config: ArcConfig, provider: ethers.JsonRpcProvider, signer: ethers.Wallet) {
    this.config = config;
    this.provider = provider;
    this.signer = signer;
    this.walletAddress = signer.address;
  }

  static async create(): Promise<Agent> {
    const config = loadArcConfig();
    const provider = new ethers.JsonRpcProvider(config.rpcUrl);
    const signer = new ethers.Wallet(config.privateKey, provider);
    return new Agent(config, provider, signer);
  }
}
