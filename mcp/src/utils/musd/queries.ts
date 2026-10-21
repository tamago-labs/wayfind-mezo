import { JsonRpcProvider, Contract, formatUnits } from "ethers";
import { MUSD_CONTRACTS, TROVE_MANAGER_ABI, STABILITY_POOL_ABI, BORROWER_OPS_ABI, INTEREST_RATE_MANAGER_ABI, ERC20_MINIMAL_ABI, PRICE_FEED_ABI } from "./contracts";

function getContracts() {
  return MUSD_CONTRACTS.testnet;
}

function getTroveManager(rpcUrl: string) {
  return new Contract(getContracts().troveManager, TROVE_MANAGER_ABI, new JsonRpcProvider(rpcUrl));
}

function getStabilityPool(rpcUrl: string) {
  return new Contract(getContracts().stabilityPool, STABILITY_POOL_ABI, new JsonRpcProvider(rpcUrl));
}

function getBorrowerOps(rpcUrl: string) {
  return new Contract(getContracts().borrowerOperations, BORROWER_OPS_ABI, new JsonRpcProvider(rpcUrl));
}

function getInterestRateManager(rpcUrl: string) {
  return new Contract(getContracts().interestRateManager, INTEREST_RATE_MANAGER_ABI, new JsonRpcProvider(rpcUrl));
}

function getMusdToken(rpcUrl: string) {
  return new Contract(getContracts().musdToken, ERC20_MINIMAL_ABI, new JsonRpcProvider(rpcUrl));
}

function getPriceFeed(rpcUrl: string) {
  return new Contract(getContracts().priceFeed, PRICE_FEED_ABI, new JsonRpcProvider(rpcUrl));
}

async function fetchPrice(rpcUrl: string): Promise<bigint> {
  const pf = getPriceFeed(rpcUrl);
  return await pf.fetchPrice() as bigint;
}

export async function fetchTroveStatus(rpcUrl: string, borrower: string) {
  const troveManager = getTroveManager(rpcUrl);
  const price = await fetchPrice(rpcUrl);

  const [status, coll, debt, principal, interestOwed, pendingDebt, pendingColl, nominalICR, lastUpdateTime] = await Promise.all([
    troveManager.getTroveStatus(borrower),
    troveManager.getTroveColl(borrower),
    troveManager.getTroveDebt(borrower),
    troveManager.getTrovePrincipal(borrower),
    troveManager.getTroveInterestOwed(borrower),
    troveManager.getPendingDebt(borrower),
    troveManager.getPendingCollateral(borrower),
    troveManager.getNominalICR(borrower),
    troveManager.getTroveStake(borrower),
  ]);

  const currentICR = Number(coll) > 0 && Number(debt) > 0
    ? ((Number(coll) * Number(price)) / Number(debt) * 100).toFixed(2)
    : "N/A";

  return {
    borrower,
    status: Number(status) === 0 ? "closed" : Number(status) === 1 ? "open" : "liquidated",
    collateral: formatUnits(coll, 18),
    totalDebt: formatUnits(debt, 18),
    principal: formatUnits(principal, 18),
    interestOwed: formatUnits(interestOwed, 18),
    pendingDebt: formatUnits(pendingDebt, 18),
    pendingCollateral: formatUnits(pendingColl, 18),
    icr: `${currentICR}%`,
    nominalICR: Number(nominalICR) > 0 ? `${(Number(nominalICR) / 1e18 * 100).toFixed(2)}%` : "N/A",
    stake: formatUnits(lastUpdateTime, 0),
  };
}

export async function fetchMusdBalance(rpcUrl: string, account: string) {
  const token = getMusdToken(rpcUrl);
  const balance = await token.balanceOf(account);
  return {
    account,
    musdBalance: formatUnits(balance, 18),
    tokenAddress: getContracts().musdToken,
  };
}

export async function fetchStabilityPoolInfo(rpcUrl: string, depositor: string) {
  const sp = getStabilityPool(rpcUrl);

  const [compoundedDeposit, collateralGain, totalDeposits] = await Promise.all([
    sp.getCompoundedMUSDDeposit(depositor),
    sp.getDepositorCollateralGain(depositor),
    sp.getTotalMUSDDeposits(),
  ]);

  return {
    depositor,
    stakedMUSD: formatUnits(compoundedDeposit, 18),
    collateralGain: formatUnits(collateralGain, 18),
    totalPoolDeposits: formatUnits(totalDeposits, 18),
  };
}

export async function fetchBorrowingFee(rpcUrl: string, musdAmount: string) {
  const borrowerOps = getBorrowerOps(rpcUrl);
  const amount = BigInt(musdAmount);
  const fee = await borrowerOps.getBorrowingFee(amount);
  const feePercent = amount > 0n ? (Number(fee) * 100 / Number(amount)).toFixed(2) : "0";
  return {
    amount: formatUnits(amount, 18),
    fee: formatUnits(fee, 18),
    feePercent: `${feePercent}%`,
  };
}

export async function fetchSystemOverview(rpcUrl: string) {
  const troveManager = getTroveManager(rpcUrl);
  const price = await fetchPrice(rpcUrl);

  const [tcr, systemColl, systemDebt, totalTroves] = await Promise.all([
    troveManager.getTCR(price),
    troveManager.getEntireSystemColl(),
    troveManager.getEntireSystemDebt(),
    troveManager.getTroveOwnersCount(),
  ]);

  return {
    tcr: Number(tcr) > 0 ? `${(Number(tcr) / 1e18 * 100).toFixed(2)}%` : "N/A",
    systemCollateral: formatUnits(systemColl, 18),
    systemDebt: formatUnits(systemDebt, 18),
    totalTroves: Number(totalTroves),
    recoveryMode: Number(tcr) < 15e17,
    btcPriceUSD: formatUnits(price, 18),
  };
}

export async function fetchInterestRate(rpcUrl: string) {
  const irm = getInterestRateManager(rpcUrl);
  const [rate, maxRate] = await Promise.all([
    irm.interestRate(),
    irm.MAX_INTEREST_RATE(),
  ]);

  return {
    currentRate: formatUnits(rate, 18),
    maxRate: formatUnits(maxRate, 18),
  };
}

export async function fetchProtocolConstants(rpcUrl: string) {
  const troveManager = getTroveManager(rpcUrl);
  const borrowerOps = getBorrowerOps(rpcUrl);

  const [ccr, mcr, redemptionRate] = await Promise.all([
    troveManager.CCR(),
    troveManager.MCR(),
    borrowerOps.redemptionRate(),
  ]);

  return {
    ccr: `${(Number(ccr) / 1e18 * 100).toFixed(2)}%`,
    mcr: `${(Number(mcr) / 1e18 * 100).toFixed(2)}%`,
    redemptionRate: formatUnits(redemptionRate, 18),
    redemptionFeePercent: `${(Number(redemptionRate) / 1e18 * 100).toFixed(2)}%`,
  };
}

export async function fetchMaxBorrowingCapacity(rpcUrl: string, borrower: string) {
  const troveManager = getTroveManager(rpcUrl);
  const capacity = await troveManager.getTroveMaxBorrowingCapacity(borrower);

  return {
    borrower,
    maxBorrowingCapacity: formatUnits(capacity, 18),
  };
}
