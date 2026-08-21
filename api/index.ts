import type { APIRequestContext } from "@playwright/test";
import { PostsClient } from "./clients/PostsClient";
import { UsersClient } from "./clients/UsersClient";

export { BaseApiClient } from "./BaseApiClient";
export type { ApiResult, RequestOptions, Query } from "./BaseApiClient";
export { PostsClient, UsersClient };
export * from "./types";

/** All resource clients bound to one request context (what the `api` fixture exposes). */
export interface ApiClients {
    posts: PostsClient;
    users: UsersClient;
}

export function createApiClients(request: APIRequestContext): ApiClients {
    return { posts: new PostsClient(request), users: new UsersClient(request) };
}
