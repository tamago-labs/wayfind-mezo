import { Agent } from "../agent";
import type { McpTool } from "../types";
import { closeTrove } from "../../utils/musd/actions";

export const MusdCloseTroveTool: McpTool = {
  name: "musd_close_trove",
  description: "Close trove, repay all debt, withdraw all collateral",
  schema: {},
  handler: async (agent: Agent, _input: Record<string, any>) => {
    const rpcUrl = agent.getRpcForChain("mezo");
    return closeTrove(rpcUrl, agent.getPrivateKey());
  },
};

