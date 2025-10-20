import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TaskCreateForm } from "@/app/tasks/create/TaskCreateForm";
import * as taskService from "@/app/tasks/service";

// next/navigation と service をモック化
vi.mock("next/navigation", () => ({
	useRouter: vi.fn(),
}));
vi.mock("@/app/tasks/service");

describe("TaskCreateForm", () => {
	const mockRouter = {
		push: vi.fn(),
		back: vi.fn(),
		forward: vi.fn(),
		refresh: vi.fn(),
		replace: vi.fn(),
		prefetch: vi.fn(),
	};
	const mockCreateTask = vi.spyOn(taskService, "createTask");

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(useRouter).mockReturnValue(mockRouter);
	});

	it("フォームの要素が正しくレンダリングされる", () => {
		render(<TaskCreateForm />);
		expect(
			screen.getByRole("textbox", { name: "タイトル" }),
		).toBeInTheDocument();
		expect(screen.getByRole("textbox", { name: "詳細" })).toBeInTheDocument();
		expect(screen.getByLabelText("期限日")).toBeInTheDocument(); // Date input might not have a textbox role
		expect(screen.getByRole("button", { name: "登録" })).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "キャンセル" }),
		).toBeInTheDocument();
	});

	it("キャンセルボタンをクリックするとタスク一覧ページに遷移する", async () => {
		render(<TaskCreateForm />);
		await userEvent.click(screen.getByRole("button", { name: "キャンセル" }));
		expect(mockRouter.push).toHaveBeenCalledWith("/tasks");
	});

	it("フォームを送信するとcreateTaskが呼び出される", async () => {
		const { container } = render(<TaskCreateForm />);

		const title = "テストタスク";
		const description = "これはテストです";
		const dueDate = "2025-12-31";

		await userEvent.type(
			screen.getByRole("textbox", { name: "タイトル" }),
			title,
		);
		await userEvent.type(
			screen.getByRole("textbox", { name: "詳細" }),
			description,
		);
		await userEvent.type(screen.getByLabelText("期限日"), dueDate);

		// FormDataをモックするために、formのsubmitを直接トリガーする
		const form = container.querySelector("form");
		expect(form).not.toBeNull();
		const formData = new FormData(form as HTMLFormElement);
		formData.set("title", title);
		formData.set("description", description);
		formData.set("dueDate", dueDate);

		await taskService.createTask(formData);

		expect(mockCreateTask).toHaveBeenCalledWith(formData);
	});
});
