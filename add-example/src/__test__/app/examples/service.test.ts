import { describe, expect, it, vi } from "vitest";
import { getPosts } from "@/app/examples/service";

const dummyData = [
	{ userId: 1, id: 1, title: "Post 1", body: "Body 1" },
	{ userId: 1, id: 2, title: "Post 2", body: "Body 2" },
];

describe("getSampleData", () => {
	it("fetches sample data", async () => {
		vi.mock("@/utils/request", () => ({
			get: vi.fn(async (url: string) => {
				expect(url).toBe("https://jsonplaceholder.typicode.com/posts");
				return {
					status: 200,
					hasError: false,
					data: dummyData,
				};
			}),
		}));

		const data = await getPosts();
		expect(data).toBeDefined();
		expect(data.status).toBe(200);
		expect(data.hasError).toBe(false);
		expect(data.error).toBeUndefined();
		expect(data.data).toEqual(dummyData);
	});
});
