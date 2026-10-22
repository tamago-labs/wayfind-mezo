import { z } from "zod";
import { parseEther } from "ethers";
import type { Agent } from "../../agent";
import type { McpTool } from "../../types";

function parseBtc(amount: string): bigint {
  const [whole, frac = ""] = amount.split(".");
  const paddedFrac = (frac + "00000000").slice(0, 8);
  return BigInt(whole + paddedFrac);
}

export const SendTokensTool: McpTool = {
  name: "send_tokens",
  description: "Send native and ERC-20 tokens on EVM chains, or BTC on Bitcoin. Returns the transaction hash.",
  schema: {
    chain: z.string().describe("Chain name (e.g., 'mezo', 'ethereum', 'bitcoin')"),
    token: z.string().describe("Token symbol (e.g., 'BTC', 'ETH', 'MEZO', 'USDC')"),
    amount: z.string().describe("Amount in human-readable format (e.g., '0.01' for 0.01 BTC/ETH)"),
    recipient: z.string().describe("Recipient wallet address"),
  },
  handler: async (agent: Agent, input: Record<string, any>) => {
    const isBtc = input.token.toUpperCase() === "BTC" || input.chain.toLowerCase() === "bitcoin";
    const rawAmount = isBtc ? parseBtc(input.amount).toString() : parseEther(input.amount).toString();
    return agent.sendTokens({
      chain: input.chain,
      token: input.token,
      amount: rawAmount,
      recipient: input.recipient,
    });
  },
};
