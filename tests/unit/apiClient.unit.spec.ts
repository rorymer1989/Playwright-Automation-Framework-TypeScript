import { test, expect } from "@playwright/test";
import type { APIRequestContext, APIResponse } from "@playwright/test";
import { BaseApiClient, PostsClient } from "../../api";

/** Minimal APIRequestContext double: records the call and returns a canned response. */
function fakeContext(status: number, text: string) {
    const calls: { url: string; options: Record<string, unknown> }[] = [];
    const response = {
        status: () => status,
        url: () => `https://api.example${calls[0]?.url ?? ""}`,
        text: () => Promise.resolve(text),
    } as unknown as APIResponse;
    const request = {
        fetch: (url: string, options: Record<string, unknown>) => {
            calls.push({ url, options });
            return Promise.resolve(response);
        },
    } as unknown as APIRequestContext;
    return { request, calls };
}

class ProbeClient extends BaseApiClient {
    probe<T>(path: string, expectStatus?: number) {
        return this.get<T>(path, { expectStatus });
    }
}

test.describe("BaseApiClient", () => {
    test("parses a JSON body and exposes the raw response", async () => {
        const { request } = fakeContext(200, '{"id":1}');
        const { response, body } = await new ProbeClient(request).probe<{ id: number }>("/x");
        expect(body).toEqual({ id: 1 });
        expect(response.status()).toBe(200);
    });

    test("returns undefined for an empty body and raw text for non-JSON", async () => {
        expect((await new ProbeClient(fakeContext(204, "").request).probe("/x")).body).toBeUndefined();
        expect((await new ProbeClient(fakeContext(200, "plain").request).probe("/x")).body).toBe("plain");
    });

    test("expectStatus fails fast with method, url, status and body excerpt", async () => {
        const { request } = fakeContext(500, "boom");
        await expect(new ProbeClient(request).probe("/x", 200)).rejects.toThrow(
            /GET .*\/x → 500 \(expected 200\)\nboom/
        );
    });

    test("prefixes basePath and forwards method, params and data", async () => {
        const { request, calls } = fakeContext(201, "{}");
        class Versioned extends BaseApiClient {
            constructor(r: APIRequestContext) {
                super(r, "/v1");
            }
            make() {
                return this.post("/items", { a: 1 }, { params: { q: "z" } });
            }
        }
        await new Versioned(request).make();
        expect(calls[0]).toEqual({
            url: "/v1/items",
            options: { method: "POST", params: { q: "z" }, headers: undefined, data: { a: 1 } },
        });
    });
});

test.describe("PostsClient", () => {
    test("maps endpoints to paths", async () => {
        const { request, calls } = fakeContext(200, "[]");
        const posts = new PostsClient(request);
        await posts.getById(7);
        await posts.listByUser(3);
        await posts.remove(7);
        expect(calls.map((c) => [c.options.method, c.url, c.options.params])).toEqual([
            ["GET", "/posts/7", undefined],
            ["GET", "/posts", { userId: 3 }],
            ["DELETE", "/posts/7", undefined],
        ]);
    });
});
