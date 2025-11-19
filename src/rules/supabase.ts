// src/rules/supabase.ts
import type { VibeFinding } from "../types";

export function detectSupabaseIssues(code: string): VibeFinding[] {
    const findings: VibeFinding[] = [];

    const usesSupabase =
        /supabase\.co/.test(code) || /from\(["']users["']\)/.test(code);

    const hasServiceRole =
        /service_role/i.test(code) ||
        /SERVICE_ROLE_KEY/.test(code) ||
        /anon|service_role/i.test(code);

    const insertsReqBody =
        /\.from\(["'][^"']+["']\)\s*\.\s*insert\s*\(\s*req\.body/ims.test(code);

    if (usesSupabase && hasServiceRole) {
        findings.push({
            id: "SupabaseServiceRole",
            ruleId: "SupabaseServiceRole",
            severity: "cursed",
            title: "Supabase: service_role key likely exposed in app code",
            detail:
                "We saw a Supabase service_role-style key in code that looks like it could run in a browser or shared app environment. That key should only live in trusted server-side config.",
        });
    }

    if (usesSupabase && insertsReqBody) {
        findings.push({
            id: "SupabaseBroadInsert",
            ruleId: "SupabaseBroadInsert",
            severity: "sus",
            title: "Supabase: inserting raw req.body into a table",
            detail:
                "We saw req.body inserted directly into a Supabase table. This can lead to over-permissive writes or unexpected data stored without validation.",
        });
    }

    return findings;
}
