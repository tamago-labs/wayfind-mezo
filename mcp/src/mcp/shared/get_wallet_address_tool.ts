import { Agent } from "../../agent";
import type { McpTool } from "../../types";
import { getNetwork } from "../../config";

const CHAIN_IDS: Record<string, Record<string, string | number>> = {
  testnet: {
    mezo: 31611,
    ethereum: 11155111,
  },
};

export const GetWalletAddressTool: McpTool = {
  name: "get_wallet_address",
  description: "Get wallet addresses for all supported chains on the configured network",
  schema: {},
  handler: async (agent: Agent, _input: Record<string, any>) => {
    const network = getNetwork();
    const chainIds = CHAIN_IDS[network];

    const addresses: Record<string, { address: string; chainId: string | number }> = {};

    for (const [chain, chainId] of Object.entries(chainIds)) {
      addresses[chain] = { address: agent.evmAddress, chainId };
    }

    return { network, btcAddress: agent.btcAddress, addresses };
  },
};
