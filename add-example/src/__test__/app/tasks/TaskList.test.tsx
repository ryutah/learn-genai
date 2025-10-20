import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TaskList } from "@/app/tasks/TaskList";
import type { Task } from "@/types/task";

const mockTasks: Task[] = [
	{
		taskId: "1",
		title: "Task 1",
		description: "",
		dueDate: "2025-10-20",
		status: "未完了",
	},
	{
		taskId: "2",
		title: "Task 2",
		description: "",
		dueDate: "2025-10-21",
		status: "完了",
	},
];

describe("TaskList Component", () => {
	it("タスクのリストを正しく表示する", () => {
		render(
			<TaskList
				tasks={mockTasks}
				onToggleStatus={() => {}}
				onEdit={() => {}}
				onDelete={() => {}}
			/>,
		);

		expect(screen.getByText("Task 1")).toBeInTheDocument();
		expect(screen.getByText("2025-10-20")).toBeInTheDocument();
		expect(screen.getByText("Task 2")).toBeInTheDocument();
		expect(screen.getByText("2025-10-21")).toBeInTheDocument();

		const checkboxes = screen.getAllByRole("checkbox");
		expect(checkboxes[0]).not.toBeChecked();
		expect(checkboxes[1]).toBeChecked();
	});

	it("チェックボックスをクリックしたときに onToggleStatus が呼び出される", () => {
		const handleToggleStatus = vi.fn();
		render(
			<TaskList
				tasks={mockTasks}
				onToggleStatus={handleToggleStatus}
				onEdit={() => {}}
				onDelete={() => {}}
			/>,
		);

		const checkboxes = screen.getAllByRole("checkbox");
		fireEvent.click(checkboxes[0]);

		expect(handleToggleStatus).toHaveBeenCalledWith("1");
	});

	it("編集ボタンをクリックしたときに onEdit が呼び出される", () => {
		const handleEdit = vi.fn();
		render(
			<TaskList
				tasks={mockTasks}
				onToggleStatus={() => {}}
				onEdit={handleEdit}
				onDelete={() => {}}
			/>,
		);

		const editButtons = screen.getAllByRole("button", { name: "編集" });
		fireEvent.click(editButtons[0]);

		expect(handleEdit).toHaveBeenCalledWith("1");
	});

	it("削除ボタンをクリックしたときに onDelete が呼び出される", () => {
		const handleDelete = vi.fn();
		render(
			<TaskList
				tasks={mockTasks}
				onToggleStatus={() => {}}
				onEdit={() => {}}
				onDelete={handleDelete}
			/>,
		);

		const deleteButtons = screen.getAllByRole("button", { name: "削除" });
		fireEvent.click(deleteButtons[0]);

		expect(handleDelete).toHaveBeenCalledWith("1");
	});

	it("タスクが空の場合にメッセージを表示する", () => {
		render(
			<TaskList
				tasks={[]}
				onToggleStatus={() => {}}
				onEdit={() => {}}
				onDelete={() => {}}
			/>,
		);

		expect(screen.getByText("タスクがありません。")).toBeInTheDocument();
	});
});
