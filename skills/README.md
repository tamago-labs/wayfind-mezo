# Mezo Agent Skills

![NPM Version](https://img.shields.io/npm/v/@tamago-labs/wayfind-mezo)

Agent skills and MCP server plugin for Mezo. Provides wallet operations, MUSD borrowing against BTC, trove management, Stability Pool staking, redemptions, and liquidations.

## Plugin Structure

```
skills/
├── AGENTS.md                              # Architecture and authoring guide
├── README.md                              # Package documentation
├── GROK_BOT_INSTALL.md                    # Grok Bot install instructions
└── plugins/
    └── mezo/
        ├── .claude-plugin/plugin.json     # Claude Code manifest
        ├── .cursor-plugin/                # Cursor manifest + MCP config
        │   ├── plugin.json
        │   └── mcp.json
        ├── .grok-plugin/                  # Grok Bot manifest + MCP config
        │   ├── plugin.json
        │   └── mcp.json
        └── skills/
            └── mezo/
                ├── SKILL.md               # Main skill (intent routing)
                └── references/
                    ├── overview.md        # Mezo platform + MUSD protocol
                    ├── setup.md           # Installation and configuration
                     └── tools.md           # All 19 tools with examples
```

## MCP Server

The MCP server is published as `@tamago-labs/wayfind-mezo` on npm.

```bash
npm install -g @tamago-labs/wayfind-mezo
```

## Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `WALLET_PASSKEY` | Yes | — | Passphrase (12+ chars) — derives encrypted wallet |
| `WAYFIND_NETWORK` | No | `testnet` | `testnet` only in v0.1 |

## Tools (19 total)

**Wallet (4):** `get_wallet_address`, `get_balances`, `send_tokens`, `get_transaction`

**MUSD Query (7):** `musd_get_trove_status`, `musd_get_stability_pool`, `musd_get_borrowing_fee`, `musd_get_system_overview`, `musd_get_interest_rate`, `musd_get_protocol_constants`, `musd_get_max_borrowing_capacity`

**MUSD Actions (8):** `musd_open_trove`, `musd_add_collateral`, `musd_withdraw_collateral`, `musd_repay_musd`, `musd_close_trove`, `musd_stake_musd`, `musd_unstake_musd`, `musd_redeem`


## License

MIT
