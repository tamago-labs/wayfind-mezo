import { z } from "zod";
import { Agent } from "../../agent";
import type { McpTool } from "../../types";
import { repayMUSD } from "../utils/musd/actions";

export const MusdRepayMUSDTools: McpTool = {
  name: "musd_repay_musd",
  description: "Repay MUSD debt",
  schema: {
    musdAmount: z.string().describe("Amount of MUSD to repay in base units (18 decimals)"),
  },
  handler: async (agent: Agent, input: Record<string, any>) => {
    const rpcUrl = agent.getRpcForChain("mezo");
    return repayMUSD(rpcUrl, agent.getPrivateKey(), input.musdAmount);
  },
};
