import { BaseApiClient, type ApiResult } from "../BaseApiClient";
import type { User } from "../types";

export class UsersClient extends BaseApiClient {
    getById(id: number): Promise<ApiResult<User>> {
        return this.get<User>(`/users/${id}`);
    }

    list(): Promise<ApiResult<User[]>> {
        return this.get<User[]>("/users");
    }
}
