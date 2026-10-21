# Mezo Tools

## Wallet Operations

### `get_wallet_address`
Get wallet addresses for all supported chains.

**Parameters:** None

**Returns:** `{ network, btcAddress, addresses: { mezo: { address, chainId }, ethereum: { address, chainId } } }`

**Example:** "What's my wallet address?"

---

### `get_balances`
Get native and token balances for a specific chain.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `chain` | string | Yes | `mezo`, `ethereum`, or `bitcoin` |
| `walletAddress` | string | No | Defaults to server's wallet |

**Returns:** Balance data with native and token amounts

**Example:** "Show my Mezo balances"

---

### `send_tokens`
Send native and ERC-20 tokens on EVM chains, or BTC on Bitcoin.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `chain` | string | Yes | `mezo`, `ethereum`, or `bitcoin` |
| `token` | string | Yes | Token symbol (e.g., `BTC`, `ETH`, `MEZO`, `USDC`) |
| `amount` | string | Yes | Amount in base units (wei/satoshi) |
| `recipient` | string | Yes | Recipient address |

**Returns:** `{ signature, chain, token, amount, recipient }`

**Example:** "Send 0.01 BTC to 0x1234..."

---

### `get_transaction`
Get transaction details and status.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `chain` | string | Yes | `mezo` or `ethereum` |
| `txHash` | string | Yes | Transaction hash |

**Returns:** `{ chain, txHash, status, blockNumber, from, to, value, gasUsed }`

**Example:** "Check transaction 0xabc..."

---

## MUSD Trove Management

### `musd_open_trove`
Open a trove: deposit BTC collateral and mint MUSD.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `maxFeePercentage` | string | Yes | Max borrowing fee in bps (e.g., `500` for 5%) |
| `musdAmount` | string | Yes | MUSD to mint in base units (18 decimals) |
| `collateralAmount` | string | Yes | BTC to deposit in base units (wei) |

**Returns:** `{ signature, collateral, musdMinted }`

**Example:** "Open a trove with 0.5 BTC and mint 10000 MUSD"

> **Note:** Min debt is 1,800 MUSD. Min collateralization is 110%. Borrowing fee is 0.1%.

---

### `musd_get_trove_status`
Check trove state: collateral, debt, ICR, interest owed.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `borrower` | string | No | Defaults to server's wallet |

**Returns:** `{ borrower, status, collateral, totalDebt, principal, interestOwed, icr }`

**Example:** "Check my trove status"

---

### `musd_add_collateral`
Add more BTC to an existing trove.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `collateralAmount` | string | Yes | BTC to add in base units (wei) |

**Returns:** `{ signature, collateralAdded }`

**Example:** "Add 0.1 BTC to my trove"

---

### `musd_withdraw_collateral`
Withdraw BTC from a trove.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `collateralAmount` | string | Yes | BTC to withdraw in base units (wei) |

**Returns:** `{ signature, collateralWithdrawn }`

**Example:** "Withdraw 0.05 BTC from my trove"

---

### `musd_repay_musd`
Repay MUSD debt.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `musdAmount` | string | Yes | MUSD to repay in base units |

**Returns:** `{ signature, repaid }`

**Example:** "Repay 500 MUSD"

---

### `musd_close_trove`
Close trove, repay all debt, withdraw all collateral.

**Parameters:** None

**Returns:** `{ signature, action: "closed" }`

**Example:** "Close my trove"

---

## Stability Pool

### `musd_stake_musd`
Stake MUSD into Stability Pool to earn liquidation rewards.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `amount` | string | Yes | MUSD to stake in base units |

**Returns:** `{ signature, staked }`

**Example:** "Stake 1000 MUSD in Stability Pool"

---

### `musd_unstake_musd`
Withdraw staked MUSD from Stability Pool.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `amount` | string | Yes | MUSD to withdraw |

**Returns:** `{ signature, withdrawn }`

**Example:** "Unstake 500 MUSD"

---

### `musd_get_stability_pool`
Check Stability Pool staked balance and collateral gains.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `depositor` | string | No | Defaults to server's wallet |

**Returns:** `{ depositor, stakedMUSD, collateralGain, totalPoolDeposits }`

**Example:** "Check my Stability Pool position"

---

## Redemptions & Liquidations

### `musd_redeem`
Redeem MUSD for BTC at $1 peg (minus 0.75% fee).

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `musdAmount` | string | Yes | MUSD to redeem in base units |
| `maxFeePercentage` | string | Yes | Max fee in bps (e.g., `100` for 1%) |

**Returns:** `{ signature, redeemed }`

**Example:** "Redeem 1000 MUSD for BTC"

> **Note:** Requires TCR >= 110%. Redeems against lowest ICR troves first.

---

### `musd_liquidate`
Liquidate an underwater trove (ICR < 110%). Earn gas compensation + collateral reward.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `borrower` | string | Yes | Address of trove to liquidate |

**Returns:** `{ signature, liquidated }`

**Example:** "Liquidate trove 0x1234..."

> **Note:** Only works when trove ICR < 110%.

---

## Protocol Info

### `musd_get_balance`
Get MUSD token balance.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `account` | string | No | Defaults to server's wallet |

**Returns:** `{ account, musdBalance, tokenAddress }`

**Example:** "How much MUSD do I have?"

---

### `musd_get_protocol_constants`
Get protocol constants: CCR, MCR, redemption fee.

**Parameters:** None

**Returns:** `{ ccr, mcr, redemptionRate, redemptionFeePercent }`

**Example:** "What are the protocol constants?"

---

### `musd_get_system_overview`
Get system-wide stats: TCR, total collateral, total debt, trove count.

**Parameters:** None

**Returns:** `{ tcr, systemCollateral, systemDebt, totalTroves, recoveryMode, btcPriceUSD }`

**Example:** "Show system overview"

---

### `musd_get_interest_rate`
Get current borrowing interest rate.

**Parameters:** None

**Returns:** `{ currentRate, maxRate }`

**Example:** "What's the current interest rate?"

---

### `musd_get_borrowing_fee`
Get borrowing fee for a given MUSD amount.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `amount` | string | Yes | MUSD amount in base units |

**Returns:** `{ amount, fee, feePercent }`

**Example:** "What's the fee to borrow 10000 MUSD?"

---

### `musd_get_max_borrowing_capacity`
Get max additional MUSD debt a trove can take.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `borrower` | string | No | Defaults to server's wallet |

**Returns:** `{ borrower, maxBorrowingCapacity }`

**Example:** "How much more MUSD can I borrow?"
