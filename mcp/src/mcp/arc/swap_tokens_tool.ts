import type { Agent } from "../agent";
import type { McpTool } from "../types";
import { z } from "zod";

export const ArcSwapTokensTool: McpTool = {
  name: "arc_swap_tokens",
  description: "Swap tokens on Arc via Circle Swap Kit. Symbol is resolved from token config (e.g. 'USDC', 'WETH', 'cirBTC').",
  schema: {
    fromSymbol: z.string().describe("Token to swap from (e.g. 'WETH')"),
    toSymbol: z.string().describe("Token to swap to (e.g. 'USDC')"),
    amount: z.string().describe("Amount of from token to swap"),
    slippagePercent: z.string().optional().describe("Slippage tolerance (default: '0.5')"),
  },
  handler: async (agent: Agent, input: Record<string, any>) => {
    return agent.swapTokens(input.fromSymbol, input.toSymbol, input.amount, input?.slippagePercent);
  },
};
