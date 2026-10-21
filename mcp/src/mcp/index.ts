import type { McpTool } from "../types";
import { GetWalletAddressTool } from "./shared/get_wallet_address_tool";
import { GetBalancesTool } from "./shared/get_balances_tool";
import { GetTransactionTool } from "./shared/get_transaction_tool";
import { SendTokensTool } from "./shared/send_tokens_tool";

export const McpTools: Record<string, McpTool> = {
  GetWalletAddress: GetWalletAddressTool,
  GetBalances: GetBalancesTool,
  GetTransaction: GetTransactionTool,
  SendTokens: SendTokensTool,
};
