#!/usr/bin/env node
import { serveStdio } from "@modelcontextprotocol/server/stdio"
import { createUiGenServer } from "./server.js"

void serveStdio(createUiGenServer)
console.error("ui-gen MCP server running on stdio")
