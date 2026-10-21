import { z } from "zod";
import { Agent } from "../../agent";
import type { McpTool } from "../../types";
import { fetchBorrowingFee } from "../utils/musd/queries";

export const MusdBorrowingFeeTool: McpTool = {
  name: "musd_get_borrowing_fee",
  description: "Get borrowing fee for a given MUSD amount (in base units)",
  schema: {
    amount: z.string().describe("MUSD amount in base units (18 decimals)"),
  },
  handler: async (agent: Agent, input: Record<string, any>) => {
    const rpcUrl = agent.getRpcForChain("mezo");
    return fetchBorrowingFee(rpcUrl, input.amount);
  },
};
