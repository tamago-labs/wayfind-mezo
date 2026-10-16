import type { Agent } from "../agent";
import type { McpTool } from "../types";
import { z } from "zod";

export const ArcGetWalletAddressTool: McpTool = {
  name: "arc_get_wallet_address",
  description: "Get the Arc wallet address derived from the configured private key",
  schema: {},
  handler: async (agent: Agent, _input: Record<string, any>) => {
    return {
      walletAddress: agent.walletAddress,
      chain: agent.config.chain,
    };
  },
};
