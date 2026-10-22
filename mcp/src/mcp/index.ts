import type { McpTool } from "../types";
import { GetWalletAddressTool } from "./shared/get_wallet_address_tool";
import { GetBalancesTool } from "./shared/get_balances_tool";
import { GetTransactionTool } from "./shared/get_transaction_tool";
import { SendTokensTool } from "./shared/send_tokens_tool";
import * as MusdTools from "./musd";

export const McpTools: Record<string, McpTool> = {
  GetWalletAddress: GetWalletAddressTool,
  GetBalances: GetBalancesTool,
  GetTransaction: GetTransactionTool,
  SendTokens: SendTokensTool,
  MusdTroveStatus: MusdTools.MusdTroveStatusTool,
  MusdStabilityPool: MusdTools.MusdStabilityPoolTool,
  MusdBorrowingFee: MusdTools.MusdBorrowingFeeTool,
  MusdSystemOverview: MusdTools.MusdSystemOverviewTool,
  MusdInterestRate: MusdTools.MusdInterestRateTool,
  MusdOpenTrove: MusdTools.MusdOpenTroveTool,
  MusdAddCollateral: MusdTools.MusdAddCollateralTool,
  MusdWithdrawCollateral: MusdTools.MusdWithdrawCollateralTool,
  MusdRepayMUSD: MusdTools.MusdRepayMUSDTools,
  MusdCloseTrove: MusdTools.MusdCloseTroveTool,
  MusdStakeMUSD: MusdTools.MusdStakeMUSDTools,
  MusdUnstakeMUSD: MusdTools.MusdUnstakeMUSDTools,
  MusdProtocolConstants: MusdTools.MusdProtocolConstantsTool,
  MusdMaxBorrowingCapacity: MusdTools.MusdMaxBorrowingCapacityTool,
  MusdRedeem: MusdTools.MusdRedeemTool,
  MusdLiquidate: MusdTools.MusdLiquidateTool,
};
