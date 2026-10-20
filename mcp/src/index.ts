#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Agent } from "./agent";

async function main() {
  const agent = await Agent.create();
  const server = new McpServer({
    name: "wayfind-mezo-mcp",
    version: "0.1.0",
  });
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main();
