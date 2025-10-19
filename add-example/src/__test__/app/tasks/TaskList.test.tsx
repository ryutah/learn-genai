import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TaskList } from "@/app/tasks/TaskList";
import type { Task } from "@/types/task";

// TaskItemをモック化して、TaskListのテストに集中する
vi.mock("@/app/tasks/TaskItem", () => ({
	TaskItem: ({ task }: { task: { title: string } }) => <div>{task.title}</div>,
}));

describe("TaskList", () => {
	const mockTasks: Task[] = [
		{
			id: 1,
			title: "タスク1",
			details: "",
			dueDate: "",
			status: "incomplete",
		},
		{
			id: 2,
			title: "タスク2",
			details: "",
			dueDate: "",
			status: "complete",
		},
	];

	it("ロード中は 'Loading...' と表示されること", () => {
		render(<TaskList tasks={[]} isLoading={true} onToggleComplete={vi.fn()} />);
		expect(screen.getByText("Loading...")).toBeInTheDocument();
	});

	it("ロード完了後、タスクのリストが表示されること", () => {
		render(
			<TaskList
				tasks={mockTasks}
				isLoading={false}
				onToggleComplete={vi.fn()}
			/>,
		);
		expect(screen.getByText("タスク1")).toBeInTheDocument();
		expect(screen.getByText("タスク2")).toBeInTheDocument();
	});

	it("タスクがない場合は空のリストが表示されること", () => {
		const { container } = render(
			<TaskList tasks={[]} isLoading={false} onToggleComplete={vi.fn()} />,
		);
		const list = container.querySelector("ul");
		expect(list).toBeInTheDocument();
		expect(list?.hasChildNodes()).toBe(false);
	});
});
