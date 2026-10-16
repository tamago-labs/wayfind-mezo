import type { Agent } from "../agent";
import type { McpTool } from "../types";
import { z } from "zod";

export const ArcListEarnVaultsTool: McpTool = {
  name: "arc_list_earn_vaults",
  description: "List all available earn vaults on Arc. Returns vaults with APY, protocol, asset, and status. Optionally filter by symbol (e.g. 'USDC', 'WETH').",
  schema: {
    symbol: z.string().optional().describe("Filter vaults by asset symbol (e.g. 'USDC', 'WETH'). Omit for all vaults."),
  },
  handler: async (agent: Agent, input: Record<string, any>) => {
    return agent.listEarnVaults(input?.symbol);
  },
};
