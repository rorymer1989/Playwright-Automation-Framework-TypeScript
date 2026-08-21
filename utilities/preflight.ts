import { logger } from "./logger";

export interface PreflightTarget {
    name: string;
    url: string;
}

export interface PreflightResult {
    name: string;
    url: string;
    ok: boolean;
    status?: number;
    error?: string;
    ms: number;
}

/** GET each URL once (no body needed) with a short timeout; any 2xx–4xx counts as reachable. */
export async function checkTargets(
    targets: PreflightTarget[],
    timeoutMs = 10_000
): Promise<PreflightResult[]> {
    return Promise.all(
        targets.map(async ({ name, url }) => {
            const started = Date.now();
            try {
                const response = await fetch(url, {
                    method: "GET",
                    redirect: "follow",
                    signal: AbortSignal.timeout(timeoutMs),
                });
                return {
                    name,
                    url,
                    ok: response.status < 500,
                    status: response.status,
                    ms: Date.now() - started,
                };
            } catch (error) {
                return {
                    name,
                    url,
                    ok: false,
                    error: error instanceof Error ? error.message : String(error),
                    ms: Date.now() - started,
                };
            }
        })
    );
}

/**
 * Fails fast when an environment URL is unreachable, instead of letting every
 * test time out individually. Empty URLs are ignored (not every project needs
 * every app). Skip with SKIP_PREFLIGHT=1.
 */
export async function preflight(targets: PreflightTarget[]): Promise<void> {
    if (process.env.SKIP_PREFLIGHT) {
        logger.debug("Preflight skipped (SKIP_PREFLIGHT set)");
        return;
    }
    const results = await checkTargets(targets.filter((t) => t.url));
    for (const r of results) {
        const detail = r.ok ? `HTTP ${r.status}` : (r.error ?? `HTTP ${r.status}`);
        const line = `Preflight ${r.name}: ${r.url} → ${detail} (${r.ms} ms)`;
        if (r.ok) logger.debug(line);
        else logger.error(line);
    }
    const down = results.filter((r) => !r.ok);
    if (down.length) {
        throw new Error(
            `Preflight failed for TEST_ENV="${process.env.TEST_ENV ?? "uat"}": ` +
                down.map((r) => `${r.name} (${r.url}): ${r.error ?? `HTTP ${r.status}`}`).join("; ") +
                ". Check config/environments/*.env or set SKIP_PREFLIGHT=1."
        );
    }
    logger.info(`✅ Preflight: ${results.length} target(s) reachable`);
}
