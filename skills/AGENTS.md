# Arc Agent Skills

Agent skills and plugin manifests for the Arc chain platform.

## Plugin model

The shared plugin payload lives in `plugins/arc`.

- **Grok Build / xAI marketplace**: `plugins/arc/.grok-plugin/plugin.json` + `plugins/arc/.grok-plugin/mcp.json`
- **Claude Code**: `plugins/arc/.claude-plugin/plugin.json`
- **Cursor**: `plugins/arc/.cursor-plugin/plugin.json`

## Skill model

The plugin ships one Arc skill:

- `plugins/arc/skills/arc/SKILL.md`

`arc` is route-first. Intent routing is defined in `SKILL.md`, and execution details are split into action-oriented references.

## Reference loading pattern

1. Read `plugins/arc/skills/arc/SKILL.md`.
2. Choose the minimum reference set needed for the request.
3. For multi-step requests, load multiple references and compose one response.

| Intent | Reference | Use for |
|---|---|---|
| Platform overview | `references/overview.md` | What Arc is, supported tokens, networks |
| Setup and configuration | `references/setup.md` | Install MCP, env vars, wallets |
| Tool usage and examples | `references/tools.md` | All 13 tools with examples and routing |

## MCP server

The MCP server is published as [`@tamago-labs/wayfind-arc-mcp`](https://www.npmjs.com/package/@tamago-labs/wayfind-arc-mcp) on npm.

- Transport: stdio (local)
- Runtime: `npx -y @tamago-labs/wayfind-arc-mcp`

### Environment variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ARC_PRIVATE_KEY` | Yes | — | EVM private key (0x...) |
| `ARC_CHAIN` | No | `mainnet` | Chain: `mainnet` or `testnet` |
| `ARC_RPC_URL` | No | Built-in | Custom Arc RPC endpoint |
| `ARC_EXPLORER_URL` | No | Built-in | Custom block explorer URL |

## Authoring guidance

When editing this plugin:

- Keep `SKILL.md` focused on routing, preflight, composition, and common operations.
- Keep references organized by information type (overview, setup, tools).
- Keep references action-oriented with reasoning. Explain why, not only what.
- Keep plugin versions aligned across Grok, Claude, and Cursor manifests.
- Bump `version` in plugin manifests when skill content changes.

## References

- [Arc](https://arc.io)
- [Arc MCP on npm](https://www.npmjs.com/package/@tamago-labs/wayfind-arc-mcp)
- [Agent Skills specification](https://agentskills.io/specification)
