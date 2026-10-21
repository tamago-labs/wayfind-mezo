export const MUSD_CONTRACTS = {
  testnet: {
    borrowerOperations: "0xCdF7028ceAB81fA0C6971208e83fa7872994beE5",
    troveManager: "0xE47c80e8c23f6B4A1aE41c34837a0599D5D16bb0",
    musdToken: "0x118917a40FAF1CD7a13dB0Ef56C86De7973Ac503",
    stabilityPool: "0x1CCA7E410eE41739792eA0A24e00349Dd247680e",
    sortedTroves: "0x722E4D24FD6Ff8b0AC679450F3D91294607268fA",
    hintHelpers: "0x4e4cBA3779d56386ED43631b4dCD6d8EacEcBCF6",
    interestRateManager: "0xD4D6c36A592A2c5e86035A6bca1d57747a567f37",
    activePool: "0x143A063F62340DA3A8bEA1C5642d18C6D0F7FF51",
    priceFeed: "0x86bCF0841622a5dAC14A313a15f96A95421b9366",
  },
  mainnet: {},
} as const;

export const BORROWER_OPS_ABI = [
  "function getBorrowingFee(uint256 _MUSDAmount) view returns (uint256)",
  "function MUSD_GAS_COMPENSATION() view returns (uint256)",
  "function openTrove(uint256 _maxFeePercentage, uint256 _MUSDAmount, address _upperHint, address _lowerHint) payable",
  "function addColl(address _upperHint, address _lowerHint) payable",
  "function withdrawColl(uint256 _collWithdrawal, address _upperHint, address _lowerHint)",
  "function repayMUSD(uint256 _MUSDamount, address _upperHint, address _lowerHint)",
  "function adjustTrove(uint256 _maxFeePercentage, uint256 _collWithdrawal, uint256 _debtChange, bool _isDebtIncrease, address _upperHint, address _lowerHint) payable",
  "function closeTrove()",
] as const;

export const TROVE_MANAGER_ABI = [
  "function getTCR(uint256 _price) view returns (uint256)",
  "function getTroveStatus(address _borrower) view returns (uint256)",
  "function getTroveColl(address _borrower) view returns (uint256)",
  "function getTroveDebt(address _borrower) view returns (uint256)",
  "function getTrovePrincipal(address _borrower) view returns (uint256)",
  "function getTroveInterestOwed(address _borrower) view returns (uint256)",
  "function getTroveStake(address _borrower) view returns (uint256)",
  "function getPendingDebt(address _borrower) view returns (uint256)",
  "function getPendingCollateral(address _borrower) view returns (uint256)",
  "function getCurrentICR(address _borrower, uint256 _price) view returns (uint256)",
  "function getNominalICR(address _borrower) view returns (uint256)",
  "function getTroveOwnersCount() view returns (uint256)",
  "function getEntireSystemColl() view returns (uint256)",
  "function getEntireSystemDebt() view returns (uint256)",
  "function L_Collateral() view returns (uint256)",
  "function L_Principal() view returns (uint256)",
  "function L_Interest() view returns (uint256)",
  "function liquidate(address _borrower)",
  "function batchLiquidateTroves(address[] _troveArray)",
  "function redeemCollateral(uint256 _MUSDAmount, address _firstRedeemHint, address _upperPartialRedemptionHint, address _lowerPartialRedemptionHint, uint256 _partialRedemptionHintNICR, uint256 _maxIterations, uint256 _maxFeePercentage)",
] as const;

export const STABILITY_POOL_ABI = [
  "function deposits(address _depositor) view returns (uint256)",
  "function getCompoundedMUSDDeposit(address _depositor) view returns (uint256)",
  "function getDepositorCollateralGain(address _depositor) view returns (uint256)",
  "function getTotalMUSDDeposits() view returns (uint256)",
  "function getEntireSystemColl() view returns (uint256)",
  "function getEntireSystemDebt() view returns (uint256)",
  "function getCollateralBalance() view returns (uint256)",
  "function P() view returns (uint256)",
  "function provideToSP(uint256 _amount, address _upperHint, address _lowerHint)",
  "function withdrawFromSP(uint256 _amount, address _upperHint, address _lowerHint)",
  "function withdrawCollateralGainToTrove(address _upperHint, address _lowerHint)",
] as const;

export const INTEREST_RATE_MANAGER_ABI = [
  "function interestRate() view returns (uint256)",
  "function interestNumerator() view returns (uint256)",
  "function MAX_INTEREST_RATE() view returns (uint256)",
  "function getAccruedInterest(address _borrower, uint256 _principal) view returns (uint256)",
] as const;

export const PRICE_FEED_ABI = [
  "function fetchPrice() view returns (uint256)",
] as const;

export const ERC20_MINIMAL_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transfer(address to, uint256 amount) returns (bool)",
] as const;

export const SORTED_TROVES_ABI = [
  "function findInsertPosition(uint256 _NICR, address _prevId, address _nextId) view returns (address, address)",
  "function getSize() view returns (uint256)",
] as const;

export const HINT_HELPERS_ABI = [
  "function getApproxHint(uint256 _NICR, uint256 _numTrials, uint256 _randomSeed) view returns (address hint, uint256 diff, uint256 randomSeed)",
  "function getRedemptionHints(uint256 _MUSDamount, uint256 _price, uint256 _maxIterations) view returns (address firstRedeemHint, uint256 partialRedemptionHintNICR, uint256 MUSDLot, uint256 collLot)",
] as const;
