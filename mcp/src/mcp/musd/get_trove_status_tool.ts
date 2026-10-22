import { z } from "zod";
import { Agent } from "../agent";
import type { McpTool } from "../types";
import { fetchTroveStatus } from "../../utils/musd/queries";

export const MusdTroveStatusTool: McpTool = {
  name: "musd_get_trove_status",
  description: "Get trove status for an address: collateral, debt, ICR, interest owed",
  schema: {
    borrower: z.string().describe("Wallet address (defaults to server's wallet)").optional(),
  },
  handler: async (agent: Agent, input: Record<string, any>) => {
    const rpcUrl = agent.getRpcForChain("mezo");
    const borrower = input.borrower || agent.evmAddress;
    return fetchTroveStatus(rpcUrl, borrower);
  },
};

