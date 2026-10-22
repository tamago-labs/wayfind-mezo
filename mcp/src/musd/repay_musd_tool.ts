import { z } from "zod";
import { parseEther } from "ethers";
import { Agent } from "../../agent";
import type { McpTool } from "../../types";
import { repayMUSD } from "../utils/musd/actions";

export const MusdRepayMUSDTools: McpTool = {
  name: "musd_repay_musd",
  description: "Repay MUSD debt",
  schema: {
    musdAmount: z.string().describe("Amount of MUSD to repay (e.g., '500' for 500 MUSD)"),
  },
  handler: async (agent: Agent, input: Record<string, any>) => {
    const rpcUrl = agent.getRpcForChain("mezo");
    return repayMUSD(rpcUrl, agent.getPrivateKey(), parseEther(input.musdAmount).toString());
  },
};
