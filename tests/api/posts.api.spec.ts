import { test, expect } from "../../fixtures/baseFixture";
import { FakerUtility } from "../../utilities/fakerUtil";

interface ApiData {
    existingPostId: number;
    existingUserId: number;
    newPost: { title: string; body: string; userId: number };
}

/**
 * API tests run in the `api` project (no browser). The `api` fixture exposes the typed
 * resource clients from `api/` (PostsClient, UsersClient) bound to API_URL.
 */
test.describe("Posts API", () => {
    test.beforeEach(async ({ allure }) => {
        await allure.feature("Posts API");
    });

    test("GET /posts/:id returns the post", async ({ api, data, assertion }) => {
        const { existingPostId, existingUserId } = data.load<ApiData>("api");

        const { response, body: post } = await api.posts.getById(existingPostId);

        assertion.assertStatus(response, 200);
        await assertion.assertJsonValue(response, "id", existingPostId);
        expect(post.userId).toBe(existingUserId);
        expect(post.title).not.toHaveLength(0);
    });

    test("GET /posts?userId= filters by user", async ({ api, data, assertion }) => {
        const { existingUserId } = data.load<ApiData>("api");

        const { response, body: posts } = await api.posts.listByUser(existingUserId);

        assertion.assertStatus(response, 200);
        expect(posts.length).toBeGreaterThan(0);
        expect(posts.every((p) => p.userId === existingUserId)).toBeTruthy();
    });

    test("POST /posts creates a post", async ({ api, data, assertion }) => {
        // Static shape from test data, dynamic content from faker
        const newPost = { ...data.load<ApiData>("api").newPost, title: FakerUtility.getSentence() };

        const { response, body: created } = await api.posts.create(newPost);

        assertion.assertStatus(response, 201);
        expect(created).toMatchObject(newPost);
        expect(created.id).toBeGreaterThan(0);
    });

    test("GET /posts/:id for a missing post returns 404", async ({ api, assertion }) => {
        const { response } = await api.posts.getById(999999);
        assertion.assertStatus(response, 404);
    });

    test("the author of a post exists as a user", async ({ api, data, assertion }) => {
        const { existingPostId } = data.load<ApiData>("api");

        const { body: post } = await api.posts.getById(existingPostId);
        const { response, body: user } = await api.users.getById(post.userId);

        assertion.assertStatus(response, 200);
        expect(user.id).toBe(post.userId);
        expect(user.email).toContain("@");
    });
});
