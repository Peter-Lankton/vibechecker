// src/rules/privacyLogs.ts
import type { VibeFinding } from "../types";

export function detectPrivacyLogs(code: string): VibeFinding[] {
    const findings: VibeFinding[] = [];

    const loggingRegex =
        /(console\.log|logger\.[a-z]+)\s*\([^)]*(email|password|token|ssn|social|address|phone|req\.body|user)/i;

    if (loggingRegex.test(code)) {
        findings.push({
            id: "PrivacyLogs",
            ruleId: "PrivacyLogs",
            severity: "sus",
            title: "Privacy: potentially sensitive data logged",
            detail:
                "We saw logging of request bodies or fields like email, password, tokens, or IDs. These can become privacy incidents if logs are exposed or retained too long.",
        });
    }

    return findings;
}
