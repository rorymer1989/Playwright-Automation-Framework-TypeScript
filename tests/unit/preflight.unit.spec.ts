import http from "node:http";
import { test, expect } from "@playwright/test";
import { checkTargets, preflight } from "../../utilities/preflight";

async function serve(status: number): Promise<{ url: string; close: () => void }> {
    const server = http.createServer((_req, res) => {
        res.statusCode = status;
        res.end();
    });
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    const { port } = server.address() as { port: number };
    return { url: `http://127.0.0.1:${port}`, close: () => server.close() };
}

test.describe("preflight", () => {
    test("2xx–4xx count as reachable, 5xx and connection errors do not", async () => {
        const ok = await serve(200);
        const notFound = await serve(404);
        const broken = await serve(503);
        try {
            const results = await checkTargets([
                { name: "ok", url: ok.url },
                { name: "404", url: notFound.url },
                { name: "503", url: broken.url },
                { name: "down", url: "http://127.0.0.1:1" },
            ]);
            expect(results.map((r) => [r.name, r.ok])).toEqual([
                ["ok", true],
                ["404", true],
                ["503", false],
                ["down", false],
            ]);
        } finally {
            ok.close();
            notFound.close();
            broken.close();
        }
    });

    test("throws a message naming every unreachable target", async () => {
        await expect(
            preflight([
                { name: "SHOP_URL", url: "http://127.0.0.1:1" },
                { name: "EMPTY", url: "" },
            ])
        ).rejects.toThrow(/Preflight failed .*SHOP_URL \(http:\/\/127\.0\.0\.1:1\)/);
    });

    test.describe("with SKIP_PREFLIGHT", () => {
        const saved = { ...process.env };

        test.beforeEach(() => {
            process.env.SKIP_PREFLIGHT = "1";
        });

        test.afterEach(() => {
            process.env = { ...saved };
        });

        test("bypasses the check", async () => {
            await expect(preflight([{ name: "down", url: "http://127.0.0.1:1" }])).resolves.toBeUndefined();
        });
    });
});
