import { z } from "zod";
import { parseEther } from "ethers";
import { Agent } from "../agent";
import type { McpTool } from "../types";
import { openTrove } from "../../utils/musd/actions";

export const MusdOpenTroveTool: McpTool = {
  name: "musd_open_trove",
  description: "Open a trove on Mezo: deposit BTC collateral and mint MUSD. Min debt: 1,800 MUSD. Min ICR: 110%. A 200 MUSD liquidation fee deposit is added to your debt (accrues interest, refunded on repayment).",
  schema: {
    musdAmount: z.string().describe("MUSD to borrow (e.g., '1800' for 1800 MUSD). Total debt = amount + 200 MUSD liquidation deposit."),
    collateralAmount: z.string().describe("BTC to deposit (e.g., '0.03' for 0.03 BTC). Must maintain >= 110% ICR with total debt."),
  },
  handler: async (agent: Agent, input: Record<string, any>) => {
    const rpcUrl = agent.getRpcForChain("mezo");
    const musdWei = parseEther(input.musdAmount).toString();
    const collateralWei = parseEther(input.collateralAmount).toString();
    return openTrove(rpcUrl, agent.getPrivateKey(), musdWei, collateralWei);
  },
};

