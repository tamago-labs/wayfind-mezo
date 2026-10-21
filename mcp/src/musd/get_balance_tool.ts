import { z } from "zod";
import { Agent } from "../../agent";
import type { McpTool } from "../../types";
import { fetchMusdBalance } from "../utils/musd/queries";

export const MusdBalanceTool: McpTool = {
  name: "musd_get_balance",
  description: "Get MUSD token balance for an address",
  schema: {
    account: z.string().describe("Wallet address (defaults to server's wallet)").optional(),
  },
  handler: async (agent: Agent, input: Record<string, any>) => {
    const rpcUrl = agent.getRpcForChain("mezo");
    const account = input.account || agent.evmAddress;
    return fetchMusdBalance(rpcUrl, account);
  },
};
