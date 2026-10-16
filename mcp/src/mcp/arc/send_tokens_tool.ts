import type { Agent } from "../agent";
import type { McpTool } from "../types";
import { z } from "zod";

export const ArcSendTokensTool: McpTool = {
  name: "arc_send_tokens",
  description: "Send tokens on Arc to a specific address. Symbol is resolved from token config (e.g. 'USDC', 'cirBTC', 'WETH').",
  schema: {
    symbol: z.string().describe("Token symbol (e.g. 'USDC', 'WETH')"),
    to: z.string().describe("Recipient address (0x...)"),
    amount: z.string().describe("Amount to send (e.g. '100.5')"),
  },
  handler: async (agent: Agent, input: Record<string, any>) => {
    return agent.sendTokens(input.symbol, input.to, input.amount);
  },
};
