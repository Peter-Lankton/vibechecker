import { VibeFinding } from "../types";

export function detectSpookySecrets(code: string): VibeFinding[] {
    const findings: VibeFinding[] = [];

    const secretRegex =
        /(service_role|api[_-]?key|secret|token|password|passwd|client_secret|private[_-]?key)/i;
    const longKeyRegex = /['"`][A-Za-z0-9+/_=-]{32,}['"`]/;

    if (secretRegex.test(code) || longKeyRegex.test(code)) {
        findings.push({
            id: "SpookySecrets",
            ruleId: "SpookySecrets",
            severity: "cursed",
            title: "SpookySecrets: possible hard-coded secrets or credentials",
            detail:
                "We saw patterns that look like keys, tokens, or secrets directly in source. These should live in env/config or a secrets manager, not in code.",
        });
    }

    return findings;
}
