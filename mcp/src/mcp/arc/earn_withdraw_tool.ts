import type { Agent } from "../agent";
import type { McpTool } from "../types";
import { z } from "zod";

export const ArcEarnWithdrawTool: McpTool = {
  name: "arc_earn_withdraw",
  description: "Withdraw tokens from a Circle Earn vault. Use arc_get_earn_position to check your balance first.",
  schema: {
    amount: z.string().describe("Amount to withdraw"),
    vaultAddress: z.string().describe("Vault address to withdraw from"),
  },
  handler: async (agent: Agent, input: any) => {
    return agent.earnWithdraw(input.amount, input.vaultAddress);
  },
};
