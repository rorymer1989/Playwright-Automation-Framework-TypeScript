/** Resource models of the demo API (`API_URL`, JSONPlaceholder). */

export interface Post {
    id: number;
    userId: number;
    title: string;
    body: string;
}

export type NewPost = Omit<Post, "id">;

export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
}
