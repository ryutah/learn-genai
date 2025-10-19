import { afterEach, describe, expect, it, vi } from "vitest";
import {
	addNewTask,
	completeTask,
	fetchTasks,
	updateExistingTask,
} from "@/app/tasks/service";
import { createTask, getTasks, updateTask } from "@/repositories/task";
import type { Task } from "@/types/task";

// リポジトリ層をモック化
vi.mock("@/repositories/task");

describe("Task Service", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("fetchTasksがリポジトリのgetTasksを呼び出すこと", async () => {
		const mockTasks: Task[] = [
			{
				id: 1,
				title: "Test Task",
				details: "",
				dueDate: "",
				status: "incomplete",
			},
		];
		(getTasks as vi.Mock).mockResolvedValue(mockTasks);

		const tasks = await fetchTasks();

		expect(getTasks).toHaveBeenCalledTimes(1);
		expect(tasks).toEqual(mockTasks);
	});

	it("addNewTaskがリポジトリのcreateTaskを呼び出すこと", async () => {
		const newTask = { title: "New", details: "", dueDate: "" };
		const createdTask: Task = { id: 1, ...newTask, status: "incomplete" };
		(createTask as vi.Mock).mockResolvedValue(createdTask);

		const result = await addNewTask(newTask);

		expect(createTask).toHaveBeenCalledWith(newTask);
		expect(result).toEqual(createdTask);
	});

	it("updateExistingTaskがリポジトリのupdateTaskを呼び出すこと", async () => {
		const partialTask = { title: "Updated" };
		const updatedTask: Task = {
			id: 1,
			title: "Updated",
			details: "",
			dueDate: "",
			status: "incomplete",
		};
		(updateTask as vi.Mock).mockResolvedValue(updatedTask);

		const result = await updateExistingTask(1, partialTask);

		expect(updateTask).toHaveBeenCalledWith(1, partialTask);
		expect(result).toEqual(updatedTask);
	});

	it("completeTaskがstatusをcompleteにしてリポジトリのupdateTaskを呼び出すこと", async () => {
		const completedTask: Task = {
			id: 1,
			title: "Test",
			details: "",
			dueDate: "",
			status: "complete",
		};
		(updateTask as vi.Mock).mockResolvedValue(completedTask);

		const result = await completeTask(1);

		expect(updateTask).toHaveBeenCalledWith(1, { status: "complete" });
		expect(result).toEqual(completedTask);
	});
});
