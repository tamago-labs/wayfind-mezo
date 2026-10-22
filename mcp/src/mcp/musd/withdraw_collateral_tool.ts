import { z } from "zod";
import { parseEther } from "ethers";
import { Agent } from "../agent";
import type { McpTool } from "../types";
import { withdrawCollateral } from "../../utils/musd/actions";

export const MusdWithdrawCollateralTool: McpTool = {
  name: "musd_withdraw_collateral",
  description: "Withdraw BTC collateral from a trove",
  schema: {
    collateralAmount: z.string().describe("Amount of BTC to withdraw (e.g., '0.005' for 0.005 BTC)"),
  },
  handler: async (agent: Agent, input: Record<string, any>) => {
    const rpcUrl = agent.getRpcForChain("mezo");
    return withdrawCollateral(rpcUrl, agent.getPrivateKey(), parseEther(input.collateralAmount).toString());
  },
};

