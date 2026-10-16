import { fetchUnifiedBalance as fetchBalance } from "@/lib/deposit";
import type { UnifiedBalanceResult } from "@/lib/deposit";

export type { UnifiedBalanceResult };

export async function fetchUnifiedBalance(
  adapter: never,
  address: string,
  chainId: number
): Promise<UnifiedBalanceResult> {
  return fetchBalance(adapter as never, chainId);
}
