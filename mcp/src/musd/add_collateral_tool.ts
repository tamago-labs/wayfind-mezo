import { z } from "zod";
import { Agent } from "../../agent";
import type { McpTool } from "../../types";
import { addCollateral } from "../utils/musd/actions";

export const MusdAddCollateralTool: McpTool = {
  name: "musd_add_collateral",
  description: "Add more BTC collateral to an existing trove",
  schema: {
    collateralAmount: z.string().describe("Amount of BTC to add in base units (wei)"),
  },
  handler: async (agent: Agent, input: Record<string, any>) => {
    const rpcUrl = agent.getRpcForChain("mezo");
    return addCollateral(rpcUrl, agent.getPrivateKey(), input.collateralAmount);
  },
};
