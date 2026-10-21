import { z } from "zod";
import { Agent } from "../../agent";
import type { McpTool } from "../../types";
import { fetchMaxBorrowingCapacity } from "../utils/musd/queries";

export const MusdMaxBorrowingCapacityTool: McpTool = {
  name: "musd_get_max_borrowing_capacity",
  description: "Get max additional MUSD debt a trove can take",
  schema: {
    borrower: z.string().describe("Wallet address (defaults to server's wallet)").optional(),
  },
  handler: async (agent: Agent, input: Record<string, any>) => {
    const rpcUrl = agent.getRpcForChain("mezo");
    const borrower = input.borrower || agent.evmAddress;
    return fetchMaxBorrowingCapacity(rpcUrl, borrower);
  },
};
