import { z } from "zod";
import { Agent } from "../../agent";
import type { McpTool } from "../../types";
import { openTrove } from "../utils/musd/actions";

export const MusdOpenTroveTool: McpTool = {
  name: "musd_open_trove",
  description: "Open a trove on Mezo: deposit BTC collateral and mint MUSD",
  schema: {
    maxFeePercentage: z.string().describe("Max borrowing fee in bps (e.g., '500' for 5%)"),
    musdAmount: z.string().describe("Amount of MUSD to mint in base units (18 decimals)"),
    collateralAmount: z.string().describe("Amount of BTC to deposit in base units (18 decimals/wei)"),
  },
  handler: async (agent: Agent, input: Record<string, any>) => {
    const rpcUrl = agent.getRpcForChain("mezo");
    return openTrove(rpcUrl, agent.getPrivateKey(), input.maxFeePercentage, input.musdAmount, input.collateralAmount);
  },
};
