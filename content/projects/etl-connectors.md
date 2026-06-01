## Problem

Enterprise customers needed survey + analytics data moved into their own BigQuery, Databricks, Snowflake-class warehouses, lakehouses, and BI systems — across nine distinct platforms with wildly different auth models, batch semantics, and schema constraints. One-off connectors don't scale.

## Solution

Architected a unified ETL platform: configurable connectors, declarative workflow definitions, and bi-directional sync protocols (REST, OAuth 2.0, webhooks, polling, event-driven). Adds a new warehouse by writing a thin connector module on top of shared primitives.

## Architecture

- **Connectors:** BigQuery, Databricks, Microsoft Fabric, AWS S3, Oracle ADW, IBM watsonx, Azure Synapse, Azure SQL, SharePoint — each one a small adapter implementing a shared `Connector` interface.
- **Workflow engine:** declarative extract → transform → validate → load steps with schema enforcement and dead-letter queue handling.
- **Reliability:** async processing, batching, exponential-backoff retries, structured logging, Sentry observability.
- **Reuse:** shared utilities (auth refresh, pagination, schema mapping) cut per-connector code by ~50%.

## Stack

Node.js · TypeScript · REST · GraphQL · OAuth 2.0 · Webhooks · BigQuery · Databricks · Microsoft Fabric · AWS S3 · Oracle ADW · IBM watsonx

## Results

- Powers thousands of sync events daily for 200+ enterprise customers.
- 99.9% pipeline uptime; sub-second latency at peak.
- New connector onboarding time cut from weeks to days.

## Links

> Internal SurveySparrow platform. Reach out for an architecture walkthrough.
