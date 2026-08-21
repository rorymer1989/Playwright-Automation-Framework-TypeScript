import type { APIRequestContext, APIResponse } from "@playwright/test";
import { logger } from "../utilities/logger";

export type Query = Record<string, string | number | boolean>;

export interface RequestOptions {
    params?: Query;
    headers?: Record<string, string>;
    /** Fail fast with a descriptive error when the status differs. Omit to let the test assert it. */
    expectStatus?: number;
}

/** Parsed result: the raw `APIResponse` (for `assertion.assertStatus`) plus the decoded body. */
export interface ApiResult<T> {
    response: APIResponse;
    body: T;
}

/**
 * Thin, typed wrapper around Playwright's `APIRequestContext`.
 * Resource clients (`api/clients/*`) extend it and expose one method per endpoint so tests
 * and UI suites can seed or verify state through the API without hand-written URLs.
 */
export class BaseApiClient {
    constructor(
        protected readonly request: APIRequestContext,
        protected readonly basePath = ""
    ) {}

    protected get<T>(path: string, options?: RequestOptions): Promise<ApiResult<T>> {
        return this.send<T>("GET", path, undefined, options);
    }

    protected post<T>(path: string, data: unknown, options?: RequestOptions): Promise<ApiResult<T>> {
        return this.send<T>("POST", path, data, options);
    }

    protected put<T>(path: string, data: unknown, options?: RequestOptions): Promise<ApiResult<T>> {
        return this.send<T>("PUT", path, data, options);
    }

    protected patch<T>(path: string, data: unknown, options?: RequestOptions): Promise<ApiResult<T>> {
        return this.send<T>("PATCH", path, data, options);
    }

    protected delete<T>(path: string, options?: RequestOptions): Promise<ApiResult<T>> {
        return this.send<T>("DELETE", path, undefined, options);
    }

    private async send<T>(
        method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
        path: string,
        data: unknown,
        { params, headers, expectStatus }: RequestOptions = {}
    ): Promise<ApiResult<T>> {
        const url = `${this.basePath}${path}`;
        logger.debug(`API ${method} ${url}`, params ?? "");

        const response = await this.request.fetch(url, { method, params, headers, data });

        if (expectStatus !== undefined && response.status() !== expectStatus) {
            const text = await response.text();
            throw new Error(
                `${method} ${response.url()} → ${response.status()} (expected ${expectStatus})\n${text.slice(0, 500)}`
            );
        }

        return { response, body: await parseBody<T>(response) };
    }
}

async function parseBody<T>(response: APIResponse): Promise<T> {
    const text = await response.text();
    if (text.length === 0) {
        return undefined as T;
    }
    try {
        return JSON.parse(text) as T;
    } catch {
        return text as unknown as T;
    }
}
