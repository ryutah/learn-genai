import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TaskItem } from "@/app/tasks/TaskItem";
import type { Task } from "@/types/task";

describe("TaskItem", () => {
	const mockTask: Task = {
		id: 1,
		title: "テストタスク",
		details: "",
		dueDate: "",
		status: "incomplete",
	};

	it("タスクのタイトルが正しく表示されること", () => {
		render(<TaskItem task={mockTask} onToggleComplete={vi.fn()} />);
		expect(screen.getByText("テストタスク")).toBeInTheDocument();
	});

	it("未完了タスクのチェックボックスはオフであること", () => {
		render(<TaskItem task={mockTask} onToggleComplete={vi.fn()} />);
		const checkbox = screen.getByRole("checkbox");
		expect(checkbox).not.toBeChecked();
	});

	it("完了タスクのチェックボックスはオンであること", () => {
		const completedTask = { ...mockTask, status: "complete" as const };
		render(<TaskItem task={completedTask} onToggleComplete={vi.fn()} />);
		const checkbox = screen.getByRole("checkbox");
		expect(checkbox).toBeChecked();
	});

	it("チェックボックスをクリックするとonToggleCompleteが呼ばれること", () => {
		const handleToggle = vi.fn();
		render(<TaskItem task={mockTask} onToggleComplete={handleToggle} />);
		const checkbox = screen.getByRole("checkbox");
		fireEvent.click(checkbox);
		expect(handleToggle).toHaveBeenCalledWith(mockTask.id, mockTask.status);
	});
});
