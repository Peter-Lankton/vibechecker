// test/engine.test.ts
import { describe, it, expect } from "vitest";
import { checkVibes, getFixPromptFor, VibeCheckResult } from "../src";

const insecureSupabaseSnippet = `
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

const mostlySafeSnippet = `
export async function listPosts(db, userId: string) {
  const posts = await db.posts.findMany({
    where: { authorId: userId },
    select: { id: true, title: true, createdAt: true },
  });

  return posts;
}
`;

describe("vibechecker core engine", () => {
    it("flags the insecure Supabase snippet as cursed with expected findings", () => {
        const result: VibeCheckResult = checkVibes(insecureSupabaseSnippet);

        expect(result.level).toBe("cursed");

        const ids = result.findings.map((f) => f.id);

        expect(ids).toContain("SpookySecrets");
        expect(ids).toContain("SupabaseServiceRole");
        expect(ids).toContain("SupabaseBroadInsert");
        expect(ids).toContain("PrivacyLogs");

        // topFinding should be one of the cursed ones
        expect(result.topFinding).not.toBeNull();
        if (result.topFinding) {
            expect(["SpookySecrets", "SupabaseServiceRole"]).toContain(
                result.topFinding.id
            );
        }
    });

    it("returns a chill VibeLevel and no findings for a safe-ish snippet", () => {
        const result: VibeCheckResult = checkVibes(mostlySafeSnippet);

        expect(result.level).toBe("chill");
        expect(result.findings.length).toBe(0);
        expect(result.topFinding).toBeNull();
    });

    it("returns a rule-specific fix prompt when one exists", () => {
        const prompt = getFixPromptFor("SpookySecrets");

        expect(prompt).toContain("SpookySecrets");
        expect(prompt).toContain("<PASTE CODE HERE>");
    });

    it("falls back to the generic prompt for unknown rules", () => {
        const prompt = getFixPromptFor("UnknownRuleId");

        expect(prompt).toContain("security and privacy risks");
        expect(prompt).toContain("<PASTE CODE HERE>");
    });
});
