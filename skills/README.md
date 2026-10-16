# Arc Agent Skills

![NPM Version](https://img.shields.io/npm/v/@tamago-labs/wayfind-arc-mcp)

Agent skills and MCP server plugin for Arc chain. Provides wallet operations, Circle Unified Balance (deposit/spend cross-chain), token swaps, and earn vault management.

## Plugin Structure

```
skills/
├── AGENTS.md                              # This file
├── README.md                              # Package documentation
├── GROK_BOT_INSTALL.md                    # Grok Bot install instructions
└── plugins/
    └── arc/
        ├── .claude-plugin/plugin.json     # Claude Code manifest
        ├── .cursor-plugin/                # Cursor manifest + MCP config
        │   ├── plugin.json
        │   └── mcp.json
        ├── .grok-plugin/                  # Grok Bot manifest + MCP config
        │   ├── plugin.json
        │   └── mcp.json
        └── skills/
            └── arc/
                ├── SKILL.md               # Main skill (intent routing)
                └── references/
                    ├── overview.md        # Platform overview
                    ├── setup.md           # Installation and configuration
                    └── tools.md           # All 13 tools with examples
```

## MCP Server

The MCP server is published as `@tamago-labs/wayfind-arc-mcp` on npm.

```bash
npm install -g @tamago-labs/wayfind-arc-mcp
```

## Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ARC_PRIVATE_KEY` | Yes | — | EVM private key (0x...) |
| `ARC_CHAIN` | No | `mainnet` | `mainnet` or `testnet` |

## License

MIT
