import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AddTaskForm } from "@/app/tasks/AddTaskForm";

describe("AddTaskForm", () => {
	it("入力して送信するとonAddTaskが呼ばれ、入力欄がクリアされること", async () => {
		const handleAddTask = vi.fn().mockResolvedValue(undefined);
		render(<AddTaskForm onAddTask={handleAddTask} />);

		const input = screen.getByLabelText("New Task Title");
		const button = screen.getByRole("button", { name: "Add Task" });

		fireEvent.change(input, { target: { value: "新しいテストタスク" } });
		fireEvent.click(button);

		expect(handleAddTask).toHaveBeenCalledWith("新しいテストタスク");

		await waitFor(() => {
			expect(
				screen.getByLabelText<HTMLInputElement>("New Task Title").value,
			).toBe("");
		});
	});

	it("入力が空のまま送信してもonAddTaskが呼ばれないこと", async () => {
		const handleAddTask = vi.fn();
		render(<AddTaskForm onAddTask={handleAddTask} />);

		const button = screen.getByRole("button", { name: "Add Task" });
		fireEvent.click(button);

		expect(handleAddTask).not.toHaveBeenCalled();
	});
});
