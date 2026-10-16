import type { Agent } from "../agent";
import type { McpTool } from "../types";
import { z } from "zod";

export const ArcDepositUnifiedBalanceTool: McpTool = {
  name: "arc_deposit_unified_balance",
  description: "Deposit USDC into Circle Unified Balance on Arc. This makes the USDC available for cross-chain spending.",
  schema: {
    amount: z.string().describe("Amount of USDC to deposit (e.g. '100.5')"),
  },
  handler: async (agent: Agent, input: any) => {
    return agent.depositUnifiedBalance(input.amount);
  },
};
