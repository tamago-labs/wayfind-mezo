import { z } from "zod";
import { parseEther } from "ethers";
import { Agent } from "../agent";
import type { McpTool } from "../types";
import { redeemMUSD } from "../../utils/musd/actions";

export const MusdRedeemTool: McpTool = {
  name: "musd_redeem",
  description: "Redeem MUSD for BTC at $1 peg (minus 0.75% fee). Burns MUSD, receives BTC.",
  schema: {
    musdAmount: z.string().describe("Amount of MUSD to redeem (e.g., '1000' for 1000 MUSD)"),
    maxFeePercentage: z.string().describe("Max redemption fee in bps (e.g., '100' for 1%)"),
  },
  handler: async (agent: Agent, input: Record<string, any>) => {
    const rpcUrl = agent.getRpcForChain("mezo");
    return redeemMUSD(rpcUrl, agent.getPrivateKey(), parseEther(input.musdAmount).toString(), input.maxFeePercentage);
  },
};

