import type { Agent } from "../agent";
import type { McpTool } from "../types";
import { z } from "zod";

export const ArcGetBalanceTool: McpTool = {
  name: "arc_get_balance",
  description: "Get all token balances for the Arc wallet. Returns USDC and all tokens configured for the current chain (mainnet or testnet).",
  schema: {},
  handler: async (agent: Agent, _input: Record<string, any>) => {
    return agent.getBalance();
  },
};
