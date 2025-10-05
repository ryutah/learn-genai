import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Example from "@/app/examples/page";

describe("Example", () => {
	render(<Example />);

	it("renders a div with text 'Example'", () => {
		expect(screen.getByText("Example")).toBeDefined();
	});
});
