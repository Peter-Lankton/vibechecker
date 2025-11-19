# VibeChecker

> Core engine for **VibeChecker** – a tiny security & privacy "vibe check" for AI-generated code.

This package contains the pure, framework-agnostic engine that powers:

- The inline **“Try a VibeCheck in your browser”** widget on UseVibeChecker.com
- The upcoming **Chrome extension** and **VS Code extension**

It runs locally in your process (Node or browser bundle). Your code does **not** need to leave your machine.

---

## Features

- 🔑 **SpookySecrets** – detects likely hard-coded secrets or credentials
- 🗄️ **SupabaseServiceRole** – flags Supabase `service_role`-style keys in app code
- 📝 **SupabaseBroadInsert** – flags broad `insert(req.body)`-style Supabase writes
- 🔍 **PrivacyLogs** – flags logs that look like they contain sensitive / personal data
- 🎚️ **VibeLevel** – summarizes a snippet as `chill`, `sus`, or `cursed`
- 🤝 **Fix prompts** – `getFixPromptFor(ruleId)` returns AI-ready “fix this” prompts

---

## Installation

```bash
npm install vibechecker
# or
yarn add vibechecker
