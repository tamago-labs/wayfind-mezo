# Mezo Agent Skills

Agent skills and plugin manifests for the Mezo platform with MUSD integration.

## Plugin model

The shared plugin payload lives in `plugins/mezo`.

- **Grok Build / xAI marketplace**: `plugins/mezo/.grok-plugin/plugin.json` + `plugins/mezo/.grok-plugin/mcp.json`
- **Claude Code**: `plugins/mezo/.claude-plugin/plugin.json`
- **Cursor**: `plugins/mezo/.cursor-plugin/plugin.json`

## Skill model

The plugin ships one Mezo skill:

- `plugins/mezo/skills/mezo/SKILL.md`

`mezo` is route-first. Intent routing is defined in `SKILL.md`, and execution details are split into action-oriented references.

## Reference loading pattern

1. Read `plugins/mezo/skills/mezo/SKILL.md`.
2. Choose the minimum reference set needed for the request.
3. For multi-step requests, load multiple references and compose one response.

| Intent | Reference | Use for |
|---|---|---|
| Platform overview | `references/overview.md` | What Mezo is, MUSD protocol, contract addresses |
| Setup and configuration | `references/setup.md` | Install MCP, passkey wallet, env vars |
| Tool usage and examples | `references/tools.md` | All 20 tools with examples and routing |

## MCP server

The MCP server is published as [`@tamago-labs/wayfind-mezo`](https://www.npmjs.com/package/@tamago-labs/wayfind-mezo) on npm.

- Transport: stdio (local)
- Runtime: `npx -y @tamago-labs/wayfind-mezo`

### Environment variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `WALLET_PASSKEY` | Yes | — | Passphrase (12+ chars) — derives encrypted wallet |
| `WAYFIND_NETWORK` | No | `testnet` | `testnet` only in v0.1 |

> **Security note:** No private key required. Wallet is derived from passphrase via PBKDF2 + BIP39. Encrypted storage at `~/.wayfind-mezo/.wallet.json`. Mnemonic backup at `~/.wayfind-mezo/REMOVE_AFTER_BACKUP.txt` — back up securely and delete.

## Authoring guidance

When editing this plugin:

- Keep `SKILL.md` focused on routing, preflight, composition, and common operations.
- Keep references organized by information type (overview, setup, tools).
- Keep references action-oriented with reasoning. Explain why, not only what.
- Keep plugin versions aligned across Grok, Claude, and Cursor manifests.
- Bump `version` in plugin manifests when skill content changes.

## References

- [Mezo](https://mezo.org)
- [MUSD Documentation](https://mezo.org/docs/developers/musd/)
- [Mezo MCP on npm](https://www.npmjs.com/package/@tamago-labs/wayfind-mezo)
- [Agent Skills specification](https://agentskills.io/specification)
