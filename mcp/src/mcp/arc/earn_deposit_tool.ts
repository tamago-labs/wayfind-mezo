import type { Agent } from "../agent";
import type { McpTool } from "../types";
import { z } from "zod";

export const ArcEarnDepositTool: McpTool = {
  name: "arc_earn_deposit",
  description: "Deposit USDC into a Circle Earn vault. Use arc_list_earn_vaults to find vault addresses.",
  schema: {
    amount: z.string().describe("Amount to deposit (e.g. '100.5')"),
    vaultAddress: z.string().describe("Vault address to deposit into (from arc_list_earn_vaults)"),
  },
  handler: async (agent: Agent, input: any) => {
    return agent.earnDeposit(input.amount, input.vaultAddress);
  },
};
