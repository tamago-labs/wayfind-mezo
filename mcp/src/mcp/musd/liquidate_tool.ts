import { z } from "zod";
import { Agent } from "../agent";
import type { McpTool } from "../types";
import { liquidateTrove } from "../../utils/musd/actions";

export const MusdLiquidateTool: McpTool = {
  name: "musd_liquidate",
  description: "Liquidate an underwater trove (ICR < 110%). Earn gas compensation + collateral reward.",
  schema: {
    borrower: z.string().describe("Address of the trove to liquidate"),
  },
  handler: async (agent: Agent, input: Record<string, any>) => {
    const rpcUrl = agent.getRpcForChain("mezo");
    return liquidateTrove(rpcUrl, agent.getPrivateKey(), input.borrower);
  },
};

