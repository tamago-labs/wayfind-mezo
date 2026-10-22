import { z } from "zod";
import { parseEther } from "ethers";
import { Agent } from "../../agent";
import type { McpTool } from "../../types";
import { fetchBorrowingFee } from "../utils/musd/queries";

export const MusdBorrowingFeeTool: McpTool = {
  name: "musd_get_borrowing_fee",
  description: "Get borrowing fee for a given MUSD amount",
  schema: {
    amount: z.string().describe("MUSD amount (e.g., '1600' for 1600 MUSD)"),
  },
  handler: async (agent: Agent, input: Record<string, any>) => {
    const rpcUrl = agent.getRpcForChain("mezo");
    return fetchBorrowingFee(rpcUrl, parseEther(input.amount).toString());
  },
};
