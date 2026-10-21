import { JsonRpcProvider, Wallet, Contract } from "ethers";
import { MUSD_CONTRACTS, BORROWER_OPS_ABI, STABILITY_POOL_ABI, SORTED_TROVES_ABI, HINT_HELPERS_ABI, TROVE_MANAGER_ABI } from "./contracts";

function getContracts() {
  return MUSD_CONTRACTS.testnet;
}

function getBorrowerOps(rpcUrl: string, wallet: Wallet) {
  return new Contract(getContracts().borrowerOperations, BORROWER_OPS_ABI, wallet);
}

function getSortedTroves(rpcUrl: string) {
  return new Contract(getContracts().sortedTroves, SORTED_TROVES_ABI, new JsonRpcProvider(rpcUrl));
}

function getHintHelpers(rpcUrl: string) {
  return new Contract(getContracts().hintHelpers, HINT_HELPERS_ABI, new JsonRpcProvider(rpcUrl));
}

async function getHints(rpcUrl: string, nicr?: bigint, upperHint?: string) {
  const sortedTroves = getSortedTroves(rpcUrl);

  if (nicr) {
    const hintHelpers = getHintHelpers(rpcUrl);
    const numTrials = 15;
    const randomSeed = Math.floor(Math.random() * 1e18);
    const { '0': approxHint } = await hintHelpers.getApproxHint(nicr, numTrials, randomSeed);
    const { '0': upper, '1': lower } = await sortedTroves.findInsertPosition(nnicr, approxHint, approxHint);
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
  maxFeePercentage: string,
  musdAmount: string,
  collateralAmount: string
) {
  const provider = new JsonRpcProvider(rpcUrl);
  const wallet = new Wallet(privateKey, provider);
  const borrowerOps = getBorrowerOps(rpcUrl, wallet);

  const nicr = (BigInt(collateralAmount) * BigInt(1e20)) / BigInt(musdAmount);
  const { upperHint, lowerHint } = await getHints(rpcUrl, nicr);

  const tx = await borrowerOps.openTrove(
    BigInt(maxFeePercentage),
    BigInt(musdAmount),
    upperHint,
    lowerHint,
    { value: BigInt(collateralAmount) }
  );
  const receipt = await tx.wait();

  return {
    signature: receipt?.hash,
    collateral: collateralAmount,
    musdMinted: musdAmount,
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

  const hints = await getHints(rpcUrl, undefined, upperHint);
  const tx = await borrowerOps.addColl(hints.upperHint, hints.lowerHint, { value: BigInt(collateralAmount) });
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

  const hints = await getHints(rpcUrl, undefined, upperHint);
  const tx = await borrowerOps.withdrawColl(BigInt(collateralAmount), hints.upperHint, hints.lowerHint);
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

  const hints = await getHints(rpcUrl, undefined, upperHint);
  const tx = await borrowerOps.repayMUSD(BigInt(musdAmount), hints.upperHint, hints.lowerHint);
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

  const tx = await sp.provideToSP(BigInt(amount), "0x0000000000000000000000000000000000000000", "0x0000000000000000000000000000000000000000");
  const receipt = await tx.wait();

  return { signature: receipt?.hash, staked: amount };
}

export async function unstakeMUSD(rpcUrl: string, privateKey: string, amount: string) {
  const provider = new JsonRpcProvider(rpcUrl);
  const wallet = new Wallet(privateKey, provider);
  const sp = new Contract(getContracts().stabilityPool, STABILITY_POOL_ABI, wallet);

  const tx = await sp.withdrawFromSP(BigInt(amount), "0x0000000000000000000000000000000000000000", "0x0000000000000000000000000000000000000000");
  const receipt = await tx.wait();

  return { signature: receipt?.hash, withdrawn: amount };
}
