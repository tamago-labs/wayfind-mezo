import { z } from "zod";

export interface ArcConfig {
  chain: "mainnet" | "testnet";
  rpcUrl: string;
  explorerUrl: string;
  chainId: number;
  privateKey: string;
}

const CHAIN_CONFIGS: Record<string, { rpcUrl: string; explorerUrl: string; chainId: number; circleChain: string }> = {
  mainnet: {
    rpcUrl: "https://rpc.mainnet.arc.io",
    explorerUrl: "https://explorer.arc.io",
    chainId: 5042,
    circleChain: "Arc",
  },
  testnet: {
    rpcUrl: "https://rpc.testnet.arc.io",
    explorerUrl: "https://explorer.testnet.arc.io",
    chainId: 5042002,
    circleChain: "Arc_Testnet",
  },
};

export function loadArcConfig(): ArcConfig {
  const chain = (process.env.ARC_CHAIN || "mainnet") as "mainnet" | "testnet";
  const chainConfig = CHAIN_CONFIGS[chain];

  const privateKey = process.env.ARC_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("ARC_PRIVATE_KEY environment variable is required");
  }

  return {
    chain,
    rpcUrl: process.env.ARC_RPC_URL || chainConfig.rpcUrl,
    explorerUrl: process.env.ARC_EXPLORER_URL || chainConfig.explorerUrl,
    chainId: chainConfig.chainId,
    privateKey,
  };
}

export function getCircleChainName(config: ArcConfig): string {
  return config.chain === "testnet" ? "Arc_Testnet" : "Arc";
}
