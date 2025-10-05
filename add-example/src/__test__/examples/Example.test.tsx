import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Example from "@/app/examples/Example";
import type { Post } from "@/types/post";

describe("Example", () => {
	describe("render with data", () => {
		it("renders a div with text 'Example' and has 2 listitem", () => {
			const posts: Post[] = [
				{ userId: 1, id: 1, title: "Post 1", body: "Body 1" },
				{ userId: 1, id: 2, title: "Post 2", body: "Body 2" },
			];

			render(
				<Example
					response={{
						data: posts,
						status: 200,
						hasError: false,
					}}
				/>,
			);

			expect(
				screen.getByRole("heading", { level: 2, name: "Example" }),
			).toBeDefined();
			const listItems = screen.getAllByRole("listitem");
			expect(listItems.length).toBe(2);
		});
	});

	describe("render without data", () => {
		it("renders a div with text 'Example' and no listitem", () => {
			render(
				<Example
					response={{
						status: 200,
						hasError: false,
					}}
				/>,
			);
			expect(
				screen.getByRole("heading", { level: 2, name: "Example" }),
			).toBeDefined();
			const listItems = screen.queryAllByRole("listitem");
			expect(listItems.length).toBe(0);
		});
	});
});
