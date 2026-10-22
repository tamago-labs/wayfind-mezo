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
  const irm = getInterestRateManager(rpcUrl);

  const results = await Promise.all([
    troveManager.getTroveStatus(borrower),
    troveManager.getTroveColl(borrower),
    troveManager.getTroveDebt(borrower),
    troveManager.getTrovePrincipal(borrower),
    troveManager.getTroveInterestOwed(borrower),
    troveManager.getPendingDebt(borrower),
    troveManager.getPendingCollateral(borrower),
    troveManager.getNominalICR(borrower),
    troveManager.getTroveStake(borrower),
    irm.interestRate(),
  ]);

  const status = results[0];
  const coll = results[1];
  const debt = results[2];
  const principal = results[3];
  const interestOwed = results[4];
  const pendingDebt = results[5];
  const pendingColl = results[6];
  const nominalICR = results[7];
  const lastUpdateTime = results[8];
  const apr = results[9];

  const icrValue = coll > 0n && debt > 0n ? ((coll * price) / debt * 100n) : 0n;
  const icrNum = Number(icrValue) / 1e18;
  const icrDisplay = icrNum > 0 && icrNum < 1e6 ? `${icrNum.toFixed(2)}%` : "N/A";

  const rawRate = Number(apr);
  const aprDisplay = rawRate > 0 ? `${(rawRate / 100).toFixed(2)}% Fixed` : "0.00%";

  return {
    borrower,
    status: Number(status) === 0 ? "closed" : Number(status) === 1 ? "open" : "liquidated",
    collateral: formatUnits(coll, 18),
    totalDebt: formatUnits(debt, 18),
    netDebt: formatUnits(debt > 200000000000000000000n ? debt - 200000000000000000000n : 0n, 18),
    principal: formatUnits(principal, 18),
    interestOwed: formatUnits(interestOwed, 18),
    pendingDebt: formatUnits(pendingDebt, 18),
    pendingCollateral: formatUnits(pendingColl, 18),
    icr: icrDisplay,
    nominalICR: nominalICR > 0n ? `${(Number(nominalICR) / 1e20 * 100).toFixed(2)}%` : "N/A",
    stake: formatUnits(lastUpdateTime, 0),
    interestRate: aprDisplay,
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
  const irm = getInterestRateManager(rpcUrl);

  const [compoundedDeposit, collateralGain, totalDeposits, apr] = await Promise.all([
    sp.getCompoundedMUSDDeposit(depositor),
    sp.getDepositorCollateralGain(depositor),
    sp.getTotalMUSDDeposits(),
    irm.interestRate(),
  ]);

  const staked = compoundedDeposit > 0n ? Number(compoundedDeposit) : 0;
  const total = totalDeposits > 0n ? Number(totalDeposits) : 1;
  const sharePct = ((staked / total) * 100).toFixed(4);

  return {
    depositor,
    stakedMUSD: formatUnits(compoundedDeposit, 18),
    collateralGain: formatUnits(collateralGain, 18),
    totalPoolDeposits: formatUnits(totalDeposits, 18),
    yourShare: `${sharePct}%`,
    interestRate: `${(Number(apr) / 100).toFixed(2)}% Fixed`,
    note: "Staking yield comes from liquidations (BTC gains) + borrowing interest."
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
    interestRate: `${(Number(rate) / 100).toFixed(2)}% Fixed`,
    maxInterestRate: `${(Number(maxRate) / 100).toFixed(2)}%`,
  };
}

export async function fetchProtocolConstants(rpcUrl: string) {
  const troveManager = getTroveManager(rpcUrl);
  const borrowerOps = getBorrowerOps(rpcUrl);

  const irm = getInterestRateManager(rpcUrl);
  const [ccr, mcr, redemptionRate, borrowApr] = await Promise.all([
    troveManager.CCR(),
    troveManager.MCR(),
    borrowerOps.redemptionRate(),
    irm.interestRate(),
  ]);

  return {
    ccr: `${(Number(ccr) / 1e18 * 100).toFixed(2)}%`,
    mcr: `${(Number(mcr) / 1e18 * 100).toFixed(2)}%`,
    redemptionRate: formatUnits(redemptionRate, 18),
    redemptionFeePercent: `${(Number(redemptionRate) / 1e18 * 100).toFixed(2)}%`,
    borrowingInterestRate: `${(Number(borrowApr) / 100).toFixed(2)}% Fixed`,
  };
}

export async function fetchMaxBorrowingCapacity(rpcUrl: string, borrower: string) {
  const troveManager = getTroveManager(rpcUrl);
  const capacity = await troveManager.getTroveMaxBorrowingCapacity(borrower);

  return {
    borrower,
    maxNetDebt: formatUnits(capacity, 18),
    maxTotalDebt: formatUnits(capacity + 200000000000000000000n, 18),
    liquidationDeposit: "200",
  };
}
