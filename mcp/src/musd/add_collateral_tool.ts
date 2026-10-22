import { z } from "zod";
import { parseEther } from "ethers";
import { Agent } from "../../agent";
import type { McpTool } from "../../types";
import { addCollateral } from "../utils/musd/actions";

export const MusdAddCollateralTool: McpTool = {
  name: "musd_add_collateral",
  description: "Add more BTC collateral to an existing trove",
  schema: {
    collateralAmount: z.string().describe("Amount of BTC to add (e.g., '0.01' for 0.01 BTC)"),
  },
  handler: async (agent: Agent, input: Record<string, any>) => {
    const rpcUrl = agent.getRpcForChain("mezo");
    return addCollateral(rpcUrl, agent.getPrivateKey(), parseEther(input.collateralAmount).toString());
  },
};
