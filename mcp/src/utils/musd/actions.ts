import { JsonRpcProvider, Wallet, Contract } from "ethers";
import { MUSD_CONTRACTS, BORROWER_OPS_ABI, STABILITY_POOL_ABI, SORTED_TROVES_ABI, HINT_HELPERS_ABI, TROVE_MANAGER_ABI } from "./contracts";

function getContracts() {
  return MUSD_CONTRACTS.testnet;
}

function getBorrowerOps(rpcUrl: string, wallet: Wallet) {
  return new Contract(getContracts().borrowerOperations, BORROWER_OPS_ABI, wallet);
}

function b(v: string | number): bigint {
  if (typeof v === "number") return BigInt(v);
  if (v.startsWith("0x") || v.startsWith("0X")) return BigInt(v);
  return BigInt(v);
}


function getSortedTroves(rpcUrl: string) {
  return new Contract(getContracts().sortedTroves, SORTED_TROVES_ABI, new JsonRpcProvider(rpcUrl));
}

function getHintHelpers(rpcUrl: string) {
  return new Contract(getContracts().hintHelpers, HINT_HELPERS_ABI, new JsonRpcProvider(rpcUrl));
}

async function getHints(rpcUrl: string, nicr: bigint, upperHint?: string) {
  const sortedTroves = getSortedTroves(rpcUrl);

  if (nicr) {
    const hintHelpers = getHintHelpers(rpcUrl);
    const numTrials = 15;
    const randomSeed = Math.floor(Math.random() * 1e6);
    const { '0': approxHint } = await hintHelpers.getApproxHint(nicr, numTrials, randomSeed);
    const { '0': upper, '1': lower } = await sortedTroves.findInsertPosition(nicr, approxHint, approxHint);
    return { upperHint: upper, lowerHint: lower };
  }

  if (upperHint) {
    const { '0': upper, '1': lower } = await sortedTroves.findInsertPosition(0n, upperHint, upperHint);
    return { upperHint: upper, lowerHint: lower };
  }

  return { upperHint: "0x0000000000000000000000000000000000000000", lowerHint: "0x0000000000000000000000000000000000000000" };
}

export async function openTrove(
  rpcUrl: string,
  privateKey: string,
  musdAmount: string,
  collateralAmount: string
) {
  const provider = new JsonRpcProvider(rpcUrl);
  const wallet = new Wallet(privateKey, provider);
  const borrowerOps = getBorrowerOps(rpcUrl, wallet);

  const collateralWei = b(collateralAmount);
  const musdWei = b(musdAmount);

  const fee = await borrowerOps.getBorrowingFee(musdWei);
  const debtAmount = musdWei + fee;

  const nicr = (collateralWei * b(1e20)) / debtAmount;

  const { upperHint, lowerHint } = await getHints(rpcUrl, nicr);

  const tx = await borrowerOps.openTrove(
    debtAmount,
    upperHint,
    lowerHint,
    { value: collateralWei }
  );
  const receipt = await tx.wait();

  const compositeDebt = debtAmount + b(200000000000000000000n);

  return {
    signature: receipt?.hash,
    collateral: collateralAmount,
    musdBorrowed: musdAmount,
    borrowingFee: fee.toString(),
    liquidationDeposit: "200000000000000000000",
    totalDebt: compositeDebt.toString(),
    netDebt: debtAmount.toString(),
    upperHint,
    lowerHint,
  };
}

export async function addCollateral(
  rpcUrl: string,
  privateKey: string,
  collateralAmount: string,
  upperHint?: string,
  lowerHint?: string
) {
  const provider = new JsonRpcProvider(rpcUrl);
  const wallet = new Wallet(privateKey, provider);
  const borrowerOps = getBorrowerOps(rpcUrl, wallet);

  const hints = await getHints(rpcUrl, 0n, upperHint);
  const tx = await borrowerOps.addColl(hints.upperHint, hints.lowerHint, { value: b(collateralAmount) });
  const receipt = await tx.wait();

  return { signature: receipt?.hash, collateralAdded: collateralAmount };
}

export async function withdrawCollateral(
  rpcUrl: string,
  privateKey: string,
  collateralAmount: string,
  upperHint?: string,
  lowerHint?: string
) {
  const provider = new JsonRpcProvider(rpcUrl);
  const wallet = new Wallet(privateKey, provider);
  const borrowerOps = getBorrowerOps(rpcUrl, wallet);

  const hints = await getHints(rpcUrl, 0n, upperHint);
  const tx = await borrowerOps.withdrawColl(b(collateralAmount), hints.upperHint, hints.lowerHint);
  const receipt = await tx.wait();

  return { signature: receipt?.hash, collateralWithdrawn: collateralAmount };
}

export async function repayMUSD(
  rpcUrl: string,
  privateKey: string,
  musdAmount: string,
  upperHint?: string,
  lowerHint?: string
) {
  const provider = new JsonRpcProvider(rpcUrl);
  const wallet = new Wallet(privateKey, provider);
  const borrowerOps = getBorrowerOps(rpcUrl, wallet);

  const hints = await getHints(rpcUrl, 0n, upperHint);
  const tx = await borrowerOps.repayMUSD(b(musdAmount), hints.upperHint, hints.lowerHint);
  const receipt = await tx.wait();

  return { signature: receipt?.hash, repaid: musdAmount };
}

export async function closeTrove(rpcUrl: string, privateKey: string) {
  const provider = new JsonRpcProvider(rpcUrl);
  const wallet = new Wallet(privateKey, provider);
  const borrowerOps = getBorrowerOps(rpcUrl, wallet);

  const tx = await borrowerOps.closeTrove();
  const receipt = await tx.wait();

  return { signature: receipt?.hash, action: "closed" };
}

export async function stakeMUSD(rpcUrl: string, privateKey: string, amount: string) {
  const provider = new JsonRpcProvider(rpcUrl);
  const wallet = new Wallet(privateKey, provider);
  const sp = new Contract(getContracts().stabilityPool, STABILITY_POOL_ABI, wallet);

  const tx = await sp.provideToSP(b(amount), "0x0000000000000000000000000000000000000000", "0x0000000000000000000000000000000000000000");
  const receipt = await tx.wait();

  return { signature: receipt?.hash, staked: amount };
}

export async function unstakeMUSD(rpcUrl: string, privateKey: string, amount: string) {
  const provider = new JsonRpcProvider(rpcUrl);
  const wallet = new Wallet(privateKey, provider);
  const sp = new Contract(getContracts().stabilityPool, STABILITY_POOL_ABI, wallet);

  const tx = await sp.withdrawFromSP(b(amount), "0x0000000000000000000000000000000000000000", "0x0000000000000000000000000000000000000000");
  const receipt = await tx.wait();

  return { signature: receipt?.hash, withdrawn: amount };
}

export async function redeemMUSD(
  rpcUrl: string,
  privateKey: string,
  musdAmount: string,
  maxFeePercentage: string
) {
  const provider = new JsonRpcProvider(rpcUrl);
  const wallet = new Wallet(privateKey, provider);
  const troveManager = new Contract(getContracts().troveManager, TROVE_MANAGER_ABI, wallet);

  const tx = await troveManager.redeemCollateral(
    b(musdAmount),
    "0x0000000000000000000000000000000000000000",
    "0x0000000000000000000000000000000000000000",
    "0x0000000000000000000000000000000000000000",
    "0",
    "0",
    b(maxFeePercentage)
  );
  const receipt = await tx.wait();

  return { signature: receipt?.hash, redeemed: musdAmount };
}

export async function liquidateTrove(rpcUrl: string, privateKey: string, borrower: string) {
  const provider = new JsonRpcProvider(rpcUrl);
  const wallet = new Wallet(privateKey, provider);
  const troveManager = new Contract(getContracts().troveManager, TROVE_MANAGER_ABI, wallet);

  const tx = await troveManager.liquidate(borrower);
  const receipt = await tx.wait();

  return { signature: receipt?.hash, liquidated: borrower };
}
