## Problem

LLM agents need to access local filesystems to read, write, and organize files — but giving raw shell access is dangerous. The Model Context Protocol (MCP) provides a structured interface, but vault-style permission scoping wasn't out-of-the-box.

## Solution

Built `file-vault-mcp` — an MCP server that exposes scoped CRUD over a designated vault directory. Agents (Claude, Cursor, custom clients) connect via stdio and get a typed toolset for safe file operations.

## Architecture

- **Transport:** stdio MCP server, JSON-RPC over standard I/O.
- **Tools exposed:** `list_files`, `read_file`, `write_file`, `delete_file`, `move_file`, `search`.
- **Sandboxing:** all paths resolved relative to a vault root; symlink escapes blocked; size/extension policies enforced.

## Stack

TypeScript · Node.js · MCP SDK · Zod schemas

## Results

- Drop-in for any MCP-compatible agent host (Claude Desktop, Cursor, etc.).
- Enables agent-driven local file workflows without exposing the full filesystem.
- Foundation for richer agent tooling (search, embeddings, code refactor) layered on top.

## Links

> Source: [github.com/jana-1729/file-vault-mcp](https://github.com/jana-1729/file-vault-mcp)
