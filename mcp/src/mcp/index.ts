import type { McpTool } from "../types";
import { ArcGetWalletAddressTool } from "./arc/get_wallet_address_tool";
import { ArcGetBalanceTool } from "./arc/get_balance_tool";
import { ArcGetUnifiedBalanceTool } from "./arc/get_unified_balance_tool";
import { ArcGetSupportedChainsTool } from "./arc/get_supported_chains_tool";
import { ArcSendTokensTool } from "./arc/send_tokens_tool";
import { ArcDepositUnifiedBalanceTool } from "./arc/deposit_unified_tool";
import { ArcSpendUnifiedBalanceTool } from "./arc/spend_unified_tool";
import { ArcGetPricesTool } from "./arc/get_prices_tool";
import { ArcSwapTokensTool } from "./arc/swap_tokens_tool";
import { ArcEarnDepositTool } from "./arc/earn_deposit_tool";
import { ArcEarnWithdrawTool } from "./arc/earn_withdraw_tool";
import { ArcListEarnVaultsTool } from "./arc/list_earn_vaults_tool";
import { ArcGetEarnPositionTool } from "./arc/get_earn_position_tool";

export const McpTools: Record<string, McpTool> = {
  ArcGetWalletAddress: ArcGetWalletAddressTool,
  ArcGetBalance: ArcGetBalanceTool,
  ArcGetUnifiedBalance: ArcGetUnifiedBalanceTool,
  ArcGetSupportedChains: ArcGetSupportedChainsTool,
  ArcSendTokens: ArcSendTokensTool,
  ArcDepositUnifiedBalance: ArcDepositUnifiedBalanceTool,
  ArcSpendUnifiedBalance: ArcSpendUnifiedBalanceTool,
  ArcGetPrices: ArcGetPricesTool,
  ArcSwapTokens: ArcSwapTokensTool,
  ArcEarnDeposit: ArcEarnDepositTool,
  ArcEarnWithdraw: ArcEarnWithdrawTool,
  ArcListEarnVaults: ArcListEarnVaultsTool,
  ArcGetEarnPosition: ArcGetEarnPositionTool,
};
