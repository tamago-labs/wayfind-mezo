import { z } from "zod";
import { parseEther } from "ethers";
import { Agent } from "../agent";
import type { McpTool } from "../types";
import { stakeMUSD, unstakeMUSD } from "../../utils/musd/actions";

export const MusdStakeMUSDTools: McpTool = {
  name: "musd_stake_musd",
  description: "Stake MUSD into Stability Pool to earn liquidation rewards",
  schema: {
    amount: z.string().describe("Amount of MUSD to stake (e.g., '500' for 500 MUSD)"),
  },
  handler: async (agent: Agent, input: Record<string, any>) => {
    const rpcUrl = agent.getRpcForChain("mezo");
    return stakeMUSD(rpcUrl, agent.getPrivateKey(), parseEther(input.amount).toString());
  },
};

export const MusdUnstakeMUSDTools: McpTool = {
  name: "musd_unstake_musd",
  description: "Withdraw staked MUSD from Stability Pool",
  schema: {
    amount: z.string().describe("Amount of MUSD to withdraw (e.g., '200' for 200 MUSD)"),
  },
  handler: async (agent: Agent, input: Record<string, any>) => {
    const rpcUrl = agent.getRpcForChain("mezo");
    return unstakeMUSD(rpcUrl, agent.getPrivateKey(), parseEther(input.amount).toString());
  },
};




