import { Agent } from "../agent";
import type { McpTool } from "../types";
import { fetchInterestRate } from "../../utils/musd/queries";

export const MusdInterestRateTool: McpTool = {
  name: "musd_get_interest_rate",
  description: "Get current borrowing interest rate and max rate",
  schema: {},
  handler: async (agent: Agent, _input: Record<string, any>) => {
    const rpcUrl = agent.getRpcForChain("mezo");
    return fetchInterestRate(rpcUrl);
  },
};

