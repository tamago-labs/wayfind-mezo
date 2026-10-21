import { Agent } from "../../agent";
import type { McpTool } from "../../types";
import { fetchSystemOverview } from "../utils/musd/queries";

export const MusdSystemOverviewTool: McpTool = {
  name: "musd_get_system_overview",
  description: "Get system-wide stats: TCR, total collateral, total debt, trove count, recovery mode",
  schema: {},
  handler: async (agent: Agent, _input: Record<string, any>) => {
    const rpcUrl = agent.getRpcForChain("mezo");
    return fetchSystemOverview(rpcUrl);
  },
};
