import type { Agent } from "../agent";
import type { McpTool } from "../types";

export const ArcGetSupportedChainsTool: McpTool = {
  name: "arc_get_supported_chains",
  description: "Get all chains supported for Unified Balance on the current network (mainnet/testnet). Returns chain names that can be used as targetChain for spend/cross-chain transfers.",
  schema: {},
  handler: async (agent: Agent, _input: Record<string, any>) => {
    return agent.getSupportedChains();
  },
};
