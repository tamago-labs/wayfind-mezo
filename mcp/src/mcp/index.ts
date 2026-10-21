import type { McpTool } from "../types";
import { GetWalletAddressTool } from "./shared/get_wallet_address_tool";

export const McpTools: Record<string, McpTool> = {
  GetWalletAddress: GetWalletAddressTool,
};
