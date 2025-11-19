import { checkVibes } from "./engine";
import { getFixPromptFor } from "./prompts";
export * from "./types";

export { checkVibes, getFixPromptFor };

/**
 * Browser helper: attach to window if it exists.
 * This is what tsup will use for the global build.
 */
declare const window: any;

if (typeof window !== "undefined") {
    // don’t clobber if someone already attached it
    window.VibeCheckerCore = window.VibeCheckerCore || {
        checkVibes,
        getFixPromptFor,
    };
}
