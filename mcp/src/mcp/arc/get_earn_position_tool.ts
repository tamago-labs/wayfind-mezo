import type { Agent } from "../agent";
import type { McpTool } from "../types";
import { z } from "zod";

export const ArcGetEarnPositionTool: McpTool = {
  name: "arc_get_earn_position",
  description: "Get your position in an earn vault. Returns current balance, shares, principal deposited, and yield earned.",
  schema: {
    vaultAddress: z.string().describe("The vault address to query (from arc_list_earn_vaults)"),
  },
  handler: async (agent: Agent, input: Record<string, any>) => {
    return agent.getEarnPosition(input.vaultAddress);
  },
};
