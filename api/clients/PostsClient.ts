import { BaseApiClient, type ApiResult } from "../BaseApiClient";
import type { NewPost, Post } from "../types";

export class PostsClient extends BaseApiClient {
    getById(id: number): Promise<ApiResult<Post>> {
        return this.get<Post>(`/posts/${id}`);
    }

    listByUser(userId: number): Promise<ApiResult<Post[]>> {
        return this.get<Post[]>("/posts", { params: { userId } });
    }

    create(post: NewPost): Promise<ApiResult<Post>> {
        return this.post<Post>("/posts", post);
    }

    update(id: number, post: Partial<NewPost>): Promise<ApiResult<Post>> {
        return this.patch<Post>(`/posts/${id}`, post);
    }

    remove(id: number): Promise<ApiResult<unknown>> {
        return this.delete(`/posts/${id}`);
    }
}
