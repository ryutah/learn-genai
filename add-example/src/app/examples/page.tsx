"use client";

import { useEffect, useState } from "react";
import type { Post } from "@/types/post";
import { Example } from "./Example";
import { getPosts } from "./service";

export default function ExamplePage() {
	const [posts, setPosts] = useState<Post[]>([]);

	useEffect(() => {
		getPosts().then(setPosts);
	}, []);

	return <Example posts={posts} />;
}
