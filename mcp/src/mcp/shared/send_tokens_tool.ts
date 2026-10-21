import { z } from "zod";
import type { Agent } from "../../agent";
import type { McpTool } from "../../types";

export const SendTokensTool: McpTool = {
  name: "send_tokens",
  description: "Send native and ERC-20 tokens on EVM chains. Returns the transaction hash.",
  schema: {
    chain: z.string().describe("Chain name (e.g., 'mezo', 'ethereum')"),
    token: z.string().describe("Token symbol (e.g., 'BTC', 'ETH', 'MEZO', 'USDC')"),
    amount: z.string().describe("Amount to send in base units (wei/satoshi)"),
    recipient: z.string().describe("Recipient wallet address"),
  },
  handler: async (agent: Agent, input: Record<string, any>) => {
    return agent.sendTokens({
      chain: input.chain,
      token: input.token,
      amount: input.amount,
      recipient: input.recipient,
    });
  },
};
