## Problem

20+ integration UIs were diverging — each team rolled their own field mapper, OAuth screen, polling indicator, sync history view. Bugs duplicated across packages, onboarding new integration teams was slow, design drift was real.

## Solution

Built and shipped a TypeScript-first React component library distributed as an internal npm package. One source of truth for every integration UI — auth screens, field mappers, polling states, error fallbacks, sync history, Lexical-backed rich text inputs.

## Architecture

- **Components:** primitives + composite blocks for the integration domain.
- **Distribution:** internal npm registry, semantic versioning, changelog automation.
- **Docs:** Storybook for visual + interaction docs, shared by design + engineering.
- **DX:** strict TypeScript types, exported from package root, tree-shakeable.

## Stack

React · TypeScript · Storybook · Lexical · npm Packages · Design Systems

## Results

- Adopted across 20+ integrations serving 100K+ users.
- ~30% dev-time reduction on new integrations.
- ~40% faster onboarding for engineers joining the integrations team.
- 99.9% component API stability across releases.

## Links

> Internal SurveySparrow package. Component catalog available on request.
