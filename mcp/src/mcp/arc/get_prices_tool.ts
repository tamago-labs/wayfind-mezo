import type { Agent } from "../agent";
import type { McpTool } from "../types";
import { z } from "zod";

export const ArcGetPricesTool: McpTool = {
  name: "arc_get_prices",
  description: "Get all token prices from CoinGecko. Returns prices for all configured tokens on the current chain (USDC, EURC, cirBTC, WETH).",
  schema: {},
  handler: async (agent: Agent, _input: Record<string, any>) => {
    const symbols = agent.getPriceSymbols();
    return agent.getPrices(symbols);
  },
};
