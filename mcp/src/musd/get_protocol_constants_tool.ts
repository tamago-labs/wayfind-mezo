import { Agent } from "../../agent";
import type { McpTool } from "../../types";
import { fetchProtocolConstants } from "../utils/musd/queries";

export const MusdProtocolConstantsTool: McpTool = {
  name: "musd_get_protocol_constants",
  description: "Get protocol constants: CCR, MCR, redemption rate",
  schema: {},
  handler: async (agent: Agent, _input: Record<string, any>) => {
    const rpcUrl = agent.getRpcForChain("mezo");
    return fetchProtocolConstants(rpcUrl);
  },
};
