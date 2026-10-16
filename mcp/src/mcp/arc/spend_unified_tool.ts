import type { Agent } from "../agent";
import type { McpTool } from "../types";
import { z } from "zod";

export const ArcSpendUnifiedBalanceTool: McpTool = {
  name: "arc_spend_unified_balance",
  description: "Spend/withdraw USDC from Circle Unified Balance. Can send to a different address and optionally bridge to another chain. Use arc_get_supported_chains to see available chains.",
  schema: {
    amount: z.string().describe("Amount of USDC to spend/withdraw"),
    recipient: z.string().optional().describe("Recipient address (defaults to sender)"),
    targetChain: z.string().optional().describe("Target chain for cross-chain transfer (use arc_get_supported_chains to list available chains)"),
  },
  handler: async (agent: Agent, input: Record<string, any>) => {
    return agent.spendUnifiedBalance(input.amount, input?.recipient, input?.targetChain);
  },
};
