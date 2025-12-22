import type { PaginatedResponse, User, UserDTO } from "./types";
import { transformUser } from "./mapper";

export async function getUsers(page: number, limit: number): Promise<PaginatedResponse<User> | null> {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users?_page=${page}&_limit=${limit}`);
    if (!response.ok) {
      throw new Error("Failed loading users");
    }
    const totalCount = response.headers.get("x-total-count");
    const data: UserDTO[] = await response.json();
    return {
      data: data.map(transformUser),
      total: Number(totalCount) || 0
    };
  } catch (e) {
    return null;
  }
}
