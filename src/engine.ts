import { VibeFinding, VibeCheckResult, VibeLevel } from "./types";
import { detectSpookySecrets } from "./rules/spookySecrets";
import { detectSupabaseIssues } from "./rules/supabase";
import { detectPrivacyLogs } from "./rules/privacyLogs";

export function checkVibes(code: string): VibeCheckResult {
    const findings: VibeFinding[] = [
        ...detectSpookySecrets(code),
        ...detectSupabaseIssues(code),
        ...detectPrivacyLogs(code),
    ];

    const level = computeVibeLevel(findings);
    const summary = buildSummary(level, findings);
    const topFinding = pickTopFinding(findings);

    return { level, findings, summary, topFinding };
}

function computeVibeLevel(findings: VibeFinding[]): VibeLevel {
    if (!findings.length) return "chill";
    if (findings.some((f) => f.severity === "cursed")) return "cursed";
    if (findings.some((f) => f.severity === "sus")) return "sus";
    return "chill";
}

function buildSummary(level: VibeLevel, findings: VibeFinding[]): string {
    if (!findings.length) {
        return "VibeLevel: chill. No obvious hard-coded secrets, risky Supabase usage, or privacy-unfriendly logs were detected.";
    }
    const labels = findings.map((f) => f.id).join(", ");
    return `VibeLevel: ${level}. Found: ${labels}.`;
}

function pickTopFinding(findings: VibeFinding[]): VibeFinding | null {
    if (!findings.length) return null;
    const rank: Record<VibeLevel, number> = { chill: 0, sus: 1, cursed: 2 };
    return findings
        .slice()
        .sort((a, b) => (rank[b.severity] || 0) - (rank[a.severity] || 0))[0];
}
