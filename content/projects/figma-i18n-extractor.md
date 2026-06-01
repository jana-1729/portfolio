## Problem

Localization teams spend hours manually copying text from Figma designs into translation spreadsheets. Designers ship strings; devs re-key them; translators get a stale JSON. Source of truth drifts.

## Solution

A Figma plugin that walks every text node in a selected frame and exports a structured JSON — ready to drop into i18n pipelines (i18next, FormatJS, custom).

## Architecture

- **Figma Plugin API:** traverses frame → children recursively, collecting `TextNode` instances.
- **Output schema:** nested keyed JSON keyed by layer name, with metadata (font, weight, line height) on each entry.
- **UI:** lightweight HTML panel inside Figma to trigger extract + download.

## Stack

TypeScript · Figma Plugin API · HTML

## Results

- Cuts copy-paste-translate workflow from hours to seconds per screen.
- Used by design teams shipping multilingual products.
- Earned its first GitHub star — small but real validation.

## Links

> Source: [github.com/jana-1729/Figma-i18n-Extractor](https://github.com/jana-1729/Figma-i18n-Extractor)
