## Problem

Single-shot LLM calls don't compose well for multi-step tasks. Production agents need a loop primitive — tool invocation, observation, planning, retry — with deterministic state and clean abort paths.

## Solution

`AgentLoop` is an experimental TypeScript runtime that orchestrates the standard agent loop: model call → tool dispatch → result → repeat, with structured state snapshots between steps.

## Architecture

- **Loop kernel:** typed iteration over `{ messages, tools, state }`.
- **Tool registry:** declarative tool defs (name, schema, handler) shared with the model.
- **Checkpoints:** each step writes a state snapshot for replay and debugging.
- **Termination:** explicit stop conditions, max-step guards, and tool-emitted halt signals.

## Stack

TypeScript · Node.js · LLM SDK (Claude/OpenAI)

## Results

- Reusable kernel for one-off scripts and longer-running agent jobs.
- Inspectable run logs for debugging tool dispatch and reasoning steps.
- Foundation for multi-agent topologies (router → workers) experimented with separately.

## Links

> Source: [github.com/jana-1729/AgentLoop](https://github.com/jana-1729/AgentLoop)
