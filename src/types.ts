export type VibeLevel = "chill" | "sus" | "cursed";

export interface VibeFinding {
    id: string;           // e.g. "SpookySecrets"
    ruleId: string;       // same as id for now
    severity: VibeLevel;  // "cursed" or "sus" usually
    title: string;
    detail: string;
    tags?: string[];
}

export interface VibeCheckResult {
    level: VibeLevel;
    findings: VibeFinding[];
    summary: string;
    topFinding: VibeFinding | null;
}
