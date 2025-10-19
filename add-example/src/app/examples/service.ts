import type { Post } from "@/types/post";
import { get } from "@/utils/request";

export async function getPosts() {
	return await get<Post[]>("https://jsonplaceholder.typicode.com/posts");
}
