// src/prompts.ts

/**
 * Map of ruleId -> fix prompt template.
 * Each template includes a <PASTE CODE HERE> placeholder that callers
 * can replace with the actual code snippet before sending to an AI.
 */
export const FIX_PROMPTS: Record<string, string> = {
    SpookySecrets: `
You are a senior application security engineer.
The code I paste after this message was flagged by my VibeChecker tool as "SpookySecrets" which means it likely contains hard coded secrets, credentials, API keys, tokens, private keys, database passwords, or other sensitive values in source code or logs.

Your job:
1. Identify every SpookySecrets issue and treat any literal credential or sensitive value as unsafe.
2. Refactor the code to remove secrets from source and logs:
   - Use configuration or environment variables or a secrets manager instead of literals.
   - Never print or log secrets or full user sensitive data.
   - Do not invent real values. Use safe placeholders like YOUR_API_KEY or CONFIG.SECRET instead.
   - If the code runs in a browser, avoid exposing privileged keys client side and call out any remaining unavoidable risk.
3. Keep behavior the same apart from making it more secure.
4. Return:
   - The fully fixed code.
   - A short bullet list explaining each change and why it improves secret handling.

Here is the code to review and fix:
<PASTE CODE HERE>
`.trim(),

    SupabaseServiceRole: `
You are a senior application security engineer.
The code I paste after this message uses a Supabase service_role style key in application code.

Your job:
1. Identify every place where privileged Supabase keys are used in code that could run in a browser or multi-tenant environment.
2. Refactor so:
   - service_role keys only live in server-side config or environment variables.
   - browser and untrusted contexts use anon/public keys only.
   - any remaining privileged calls are wrapped in server-side APIs that perform proper auth and authorization.
3. Keep behavior the same apart from improving security.
4. Return:
   - The fixed code (or pseudo-code if it requires serverless functions or APIs).
   - A short list of changes and why they matter.

Here is the code to review and fix:
<PASTE CODE HERE>
`.trim(),

    SupabaseBroadInsert: `
You are a senior application security engineer.
The code I paste after this message performs Supabase inserts or updates using raw req.body data.

Your job:
1. Identify every Supabase query that uses req.body or other unvalidated input directly.
2. Refactor so:
   - Only expected fields are whitelisted and written.
   - Extra or unexpected fields from the client are ignored or rejected.
   - Any per-user data is correctly scoped to the authenticated user.
3. Keep behavior the same apart from making it more robust and secure.
4. Return:
   - The fixed code.
   - A short list of the key validation and authorization checks you added.

Here is the code to review and fix:
<PASTE CODE HERE>
`.trim(),

    PrivacyLogs: `
You are a senior privacy-aware application security engineer.
The code I paste after this message was flagged for logging potentially sensitive or personal data.

Your job:
1. Identify every log statement that includes request bodies, credentials, tokens, or user-identifying fields (email, phone, address, ID numbers, etc).
2. Refactor logging so:
   - Secrets and credentials are never logged.
   - Personal data is minimized, masked, or removed unless strictly necessary for debugging.
   - Logs avoid violating common privacy expectations under GDPR/CCPA/HIPAA and similar rules.
3. Keep behavior the same apart from safer logging.
4. Return:
   - The fixed code.
   - A short list of what you stopped logging or masked and why.

Here is the code to review and fix:
<PASTE CODE HERE>
`.trim(),
};

/**
 * Generic fallback prompt used when we don't have a rule-specific template.
 */
export const GENERIC_PROMPT = `
You are a senior application security engineer.
The code I paste after this message was flagged by my VibeChecker tool for security and privacy risks.

Your job:
1. Identify and explain the most important security or privacy issues.
2. Refactor the code to mitigate those issues while keeping behavior the same where possible.
3. Avoid logging or hard-coding secrets or personal data.
4. Return:
   - The fixed code.
   - A concise list of changes and why they matter.

Here is the code to review and fix:
<PASTE CODE HERE>
`.trim();

/**
 * Return the fix prompt for a given ruleId, or a generic prompt if
 * we don't have a specific one.
 */
export function getFixPromptFor(ruleId: string): string {
    return FIX_PROMPTS[ruleId] ?? GENERIC_PROMPT;
}
