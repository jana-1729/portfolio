## Problem

Customer support and product teams using Jira wanted survey data IN their issue workflow — automatically create tickets from negative responses, embed surveys inside Jira issues for follow-up, fire surveys when a ticket changes status. Manual copy-paste was the status quo.

## Solution

Built and launched SurveySparrow's Jira integration on the Atlassian Marketplace. Bi-directional sync, deep ticket embedding, event-triggered share rules, and live OAuth health monitoring.

## Architecture

- **Platform:** Atlassian Forge for the marketplace runtime; OAuth 2.0 for auth.
- **Sync:** webhook-driven on survey response → Jira ticket creation/update; polling fallback for OAuth token validation.
- **Embedding:** SurveySparrow surveys rendered inside Jira issue panels via Forge UI Kit + Atlassian Design System primitives.
- **Triggers:** rule-engine for "share survey when Jira event X fires" — status changes, field updates, assignee changes.

## Stack

React · Atlassian Forge · Jira · Atlassian Design System · OAuth 2.0 · Polling · Webhooks

## Results

- Live on the [Atlassian Marketplace](https://marketplace.atlassian.com).
- Thousands of bi-directional events processed daily.
- ~50% reduction in manual ticket-to-survey copy effort for customer success teams.

## Links

> Public listing: [Atlassian Marketplace — SurveySparrow](https://marketplace.atlassian.com).
