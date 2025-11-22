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
````

---

## Quick start (Node / bundlers)

```ts
import { checkVibes, getFixPromptFor } from "vibechecker";

const code = `
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://your-project-id.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.SERVICE_ROLE_KEY_HERE"
);

export async function createUserInsecure(req: any) {
  const { data, error } = await supabase
    .from("users")
    .insert(req.body)
    .select();

  console.log("Inserted user payload:", req.body);
  console.log("Supabase response:", { data, error });

  return { data, error };
}
`;

const result = checkVibes(code);

console.log(result.level);        // "cursed"
console.log(result.findings);     // array of findings

if (result.topFinding) {
  const promptTemplate = getFixPromptFor(result.topFinding.ruleId);
  const prompt = promptTemplate.replace("<PASTE CODE HERE>", code);

  console.log(prompt);
}
```

---

## Browser usage

The package ships a small IIFE bundle that attaches itself to `window.VibeCheckerCore`.

Example with a script tag (via unpkg):

```html
<script src="https://unpkg.com/vibechecker@0.1.0/dist/index.global.js"></script>
<script>
  const { checkVibes, getFixPromptFor } = window.VibeCheckerCore;

  const code = "const password = 'secret-dev-password';";
  const result = checkVibes(code);

  console.log(result.level); // "cursed"
</script>
```

In your own build, you can also import it directly and let your bundler tree-shake it.

---

## API

### `checkVibes(code: string): VibeCheckResult`

Run a security / privacy vibe check on a single code snippet or small file.

```ts
import { checkVibes } from "vibechecker";

const result = checkVibes(code);
```

**`VibeCheckResult`**

```ts
type VibeLevel = "chill" | "sus" | "cursed";

interface VibeFinding {
  id: string;            // e.g. "SpookySecrets"
  ruleId: string;        // same as id for now
  severity: VibeLevel;   // usually "sus" or "cursed"
  title: string;
  detail: string;
  tags?: string[];
}

interface VibeCheckResult {
  level: VibeLevel;
  findings: VibeFinding[];
  summary: string;
  topFinding: VibeFinding | null;
}
```

### `getFixPromptFor(ruleId: string): string`

Return an **AI-ready prompt template** for a given rule.

```ts
import { getFixPromptFor } from "vibechecker";

const template = getFixPromptFor("SpookySecrets");
const prompt = template.replace("<PASTE CODE HERE>", code);
```

If there is no rule-specific prompt, this falls back to a generic “please review and fix security & privacy risks” prompt.

---

## Current rules

VibeChecker Core currently ships with these rules:

* **SpookySecrets**
  Detects likely hard-coded secrets or credentials (keys, tokens, passwords, long random strings, etc).

* **SupabaseServiceRole**
  Flags what looks like a Supabase `service_role`-style key used in app / browser code.

* **SupabaseBroadInsert**
  Flags Supabase calls that insert raw `req.body` data directly into a table.

* **PrivacyLogs**
  Flags log statements that include request bodies or fields that look like emails, passwords, tokens, IDs, etc.

The rule set will grow over time; treating rule IDs and the `VibeFinding` shape as stable is safe for integrating extensions.

---

## Privacy model

This package is **just a library**:

* It runs in your process (Node, browser, extension, editor).
* It does not send your code or findings anywhere.
* Any network calls or storage are entirely up to the host application.

This makes it suitable for local-only workflows, browser-only tools, or editor extensions where code should not leave the machine.

---

## Development

Clone the repo:

```bash
git clone https://github.com/Peter-Lankton/vibechecker.git
cd vibechecker
npm install
```

Run tests:

```bash
npm test
```

Build:

```bash
npm run build
```

The compiled output goes into `dist/`.

Because we use a `prepare` script, building happens automatically before publishing to npm or when installing from Git.

---

## License

This project is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.
See the [LICENSE](./LICENSE) file for details.

Using this library in a networked service can trigger AGPL’s copyleft requirements; make sure that fits your plans before using it in closed-source products.

