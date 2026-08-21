import { test, expect } from "../../fixtures/baseFixture";
import { FakerUtility } from "../../utilities/fakerUtil";

interface ApiData {
    existingPostId: number;
    existingUserId: number;
    newPost: { title: string; body: string; userId: number };
}

interface Post {
    id: number;
    userId: number;
    title: string;
    body: string;
}

/**
 * API tests run in the `api` project (no browser). `request` is Playwright's built-in
 * APIRequestContext, already pointed at API_URL through `use.baseURL`.
 */
test.describe("Posts API", () => {
    test.beforeEach(async ({ allure }) => {
        await allure.feature("Posts API");
    });

    test("GET /posts/:id returns the post", async ({ request, data, assertion }) => {
        const { existingPostId, existingUserId } = data.load<ApiData>("api");

        const response = await request.get(`/posts/${existingPostId}`);

        assertion.assertStatus(response, 200);
        await assertion.assertJsonValue(response, "id", existingPostId);
        await assertion.assertJsonValue(response, "userId", existingUserId);

        const post = (await response.json()) as Post;
        expect(post.title).not.toHaveLength(0);
    });

    test("GET /posts?userId= filters by user", async ({ request, data }) => {
        const { existingUserId } = data.load<ApiData>("api");

        const response = await request.get("/posts", { params: { userId: existingUserId } });
        expect(response.ok()).toBeTruthy();

        const posts = (await response.json()) as Post[];
        expect(posts.length).toBeGreaterThan(0);
        expect(posts.every((p) => p.userId === existingUserId)).toBeTruthy();
    });

    test("POST /posts creates a post", async ({ request, data, assertion }) => {
        // Static shape from test data, dynamic content from faker
        const newPost = { ...data.load<ApiData>("api").newPost, title: FakerUtility.getSentence() };

        const response = await request.post("/posts", { data: newPost });

        assertion.assertStatus(response, 201);
        const created = (await response.json()) as Post;
        expect(created).toMatchObject(newPost);
        expect(created.id).toBeGreaterThan(0);
    });

    test("GET /posts/:id for a missing post returns 404", async ({ request, assertion }) => {
        const response = await request.get("/posts/999999");
        assertion.assertStatus(response, 404);
    });
});
