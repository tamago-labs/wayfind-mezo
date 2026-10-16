import type { Agent } from "../agent";
import type { McpTool } from "../types";

export const ArcGetUnifiedBalanceTool: McpTool = {
  name: "arc_get_unified_balance",
  description: "Get Circle Unified Balance. Shows total USDC balance and breakdown by network.",
  schema: {},
  handler: async (agent: Agent, _input: Record<string, any>) => {
    return agent.getUnifiedBalance();
  },
};
