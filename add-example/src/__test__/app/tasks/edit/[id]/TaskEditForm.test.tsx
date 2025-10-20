import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TaskEditForm } from "@/app/tasks/edit/[id]/TaskEditForm";
import * as taskService from "@/app/tasks/service";
import type { Task } from "@/types/task";

// next/navigation と service をモック化
vi.mock("next/navigation", () => ({
	useRouter: vi.fn(),
}));
vi.mock("@/app/tasks/service");

const mockTask: Task = {
	taskId: "1",
	title: "既存のタスク",
	description: "これは既存のタスクです。",
	dueDate: "2025-11-01",
	status: "未完了",
};

describe("TaskEditForm", () => {
	const mockRouter = {
		push: vi.fn(),
		back: vi.fn(),
		forward: vi.fn(),
		refresh: vi.fn(),
		replace: vi.fn(),
		prefetch: vi.fn(),
	};
	const mockUpdateTask = vi.spyOn(taskService, "updateTask");
	const mockDeleteTask = vi.spyOn(taskService, "deleteTask");

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(useRouter).mockReturnValue(mockRouter);
		window.confirm = vi.fn(() => true); // confirmダイアログを常にtrueで返す
	});

	it("フォームの要素がタスクの初期値で正しくレンダリングされる", () => {
		render(<TaskEditForm task={mockTask} />);
		expect(screen.getByRole("textbox", { name: "タイトル" })).toHaveValue(
			mockTask.title,
		);
		expect(screen.getByRole("textbox", { name: "詳細" })).toHaveValue(
			mockTask.description,
		);
		expect(screen.getByLabelText("期限日")).toHaveValue(mockTask.dueDate);
		expect(screen.getByRole("button", { name: "更新" })).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "キャンセル" }),
		).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "削除" })).toBeInTheDocument();
	});

	it("フォームを送信するとupdateTaskが呼び出される", async () => {
		const { container } = render(<TaskEditForm task={mockTask} />);
		const updatedTitle = "更新されたタスク";
		await userEvent.clear(screen.getByRole("textbox", { name: "タイトル" }));
		await userEvent.type(
			screen.getByRole("textbox", { name: "タイトル" }),
			updatedTitle,
		);

		const form = container.querySelector("form");
		expect(form).not.toBeNull();
		const formData = new FormData(form as HTMLFormElement);
		formData.set("title", updatedTitle);

		// updateTaskはbindされているので、モックを直接呼び出す
		await taskService.updateTask(mockTask.taskId, formData);

		expect(mockUpdateTask).toHaveBeenCalledWith(mockTask.taskId, formData);
	});

	it("削除ボタンをクリックするとdeleteTaskが呼び出される", async () => {
		render(<TaskEditForm task={mockTask} />);
		await userEvent.click(screen.getByRole("button", { name: "削除" }));

		expect(window.confirm).toHaveBeenCalledWith("本当に削除しますか？");
		expect(mockDeleteTask).toHaveBeenCalledWith(mockTask.taskId);
		expect(mockRouter.push).toHaveBeenCalledWith("/tasks");
	});
});
