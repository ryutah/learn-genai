import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Example } from "@/app/examples/Example";
import type { Post } from "@/types/post";

describe("Example", () => {
	it("h1が正しく表示されている", () => {
		render(<Example posts={[]} />);
		const h1 = screen.getByRole("heading", { level: 1 });
		expect(h1).toBeInTheDocument();
		expect(h1).toHaveTextContent("Example");
	});

	it("pが正しく表示されている", () => {
		render(<Example posts={[]} />);
		const p = screen.getByText("This is an example page.");
		expect(p).toBeInTheDocument();
	});

	it("renders a list of posts", () => {
		const mockPosts: Post[] = [
			{ id: 1, title: "Post 1", body: "Body 1", userId: 1 },
			{ id: 2, title: "Post 2", body: "Body 2", userId: 1 },
		];
		render(<Example posts={mockPosts} />);
		const listItems = screen.getAllByRole("listitem");
		expect(listItems).toHaveLength(2);
		expect(listItems[0]).toHaveTextContent("Post 1");
		expect(listItems[1]).toHaveTextContent("Post 2");
	});
});
