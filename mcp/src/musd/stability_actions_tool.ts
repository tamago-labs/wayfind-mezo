import { z } from "zod";
import { Agent } from "../../agent";
import type { McpTool } from "../../types";
import { stakeMUSD, unstakeMUSD } from "../utils/musd/actions";

export const MusdStakeMUSDTools: McpTool = {
  name: "musd_stake_musd",
  description: "Stake MUSD into Stability Pool to earn liquidation rewards",
  schema: {
    amount: z.string().describe("Amount of MUSD to stake in base units (18 decimals)"),
  },
  handler: async (agent: Agent, input: Record<string, any>) => {
    const rpcUrl = agent.getRpcForChain("mezo");
    return stakeMUSD(rpcUrl, agent.getPrivateKey(), input.amount);
  },
};

export const MusdUnstakeMUSDTools: McpTool = {
  name: "musd_unstake_musd",
  description: "Withdraw staked MUSD from Stability Pool",
  schema: {
    amount: z.string().describe("Amount of MUSD to withdraw from Stability Pool"),
  },
  handler: async (agent: Agent, input: Record<string, any>) => {
    const rpcUrl = agent.getRpcForChain("mezo");
    return unstakeMUSD(rpcUrl, agent.getPrivateKey(), input.amount);
  },
};
