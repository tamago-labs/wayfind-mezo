import { z } from "zod";
import { Agent } from "../../agent";
import type { McpTool } from "../../types";
import { fetchStabilityPoolInfo } from "../utils/musd/queries";

export const MusdStabilityPoolTool: McpTool = {
  name: "musd_get_stability_pool",
  description: "Get stability pool staked MUSD and collateral gains for an address",
  schema: {
    depositor: z.string().describe("Wallet address (defaults to server's wallet)").optional(),
  },
  handler: async (agent: Agent, input: Record<string, any>) => {
    const rpcUrl = agent.getRpcForChain("mezo");
    const depositor = input.depositor || agent.evmAddress;
    return fetchStabilityPoolInfo(rpcUrl, depositor);
  },
};
