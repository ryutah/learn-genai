import type { Post } from "@/types/post";

/**
 * Example Presentational Component
 * @param posts - list of posts
 */
export function Example({ posts }: { posts: Post[] }) {
	return (
		<div>
			<h1>Example</h1>
			<p>This is an example page.</p>
			<ul>
				{posts.map((post) => (
					<li key={post.id}>{post.title}</li>
				))}
			</ul>
		</div>
	);
}
