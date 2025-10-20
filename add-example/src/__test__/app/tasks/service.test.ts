import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	createTask,
	deleteTask,
	toggleTaskStatus,
	updateTask,
} from "@/app/tasks/service";
import * as taskRepository from "@/repositories/task";
import type { Task } from "@/types/task";

// Mock dependencies
vi.mock("@/repositories/task", () => ({
	createTask: vi.fn(),
	updateTask: vi.fn(),
	deleteTask: vi.fn(),
	getTasks: vi.fn(),
}));

vi.mock("next/cache", () => ({
	revalidatePath: vi.fn(),
}));

vi.mock("next/navigation", () => ({
	redirect: vi.fn(),
}));

describe("Task Service", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("createTask", () => {
		it("should create a new task and redirect", async () => {
			const formData = new FormData();
			formData.append("title", "Test Title");
			formData.append("description", "Test Description");
			formData.append("dueDate", "2025-12-31");

			await createTask(formData);

			expect(taskRepository.createTask).toHaveBeenCalledWith({
				title: "Test Title",
				description: "Test Description",
				dueDate: "2025-12-31",
				status: "未完了",
			});
			expect(revalidatePath).toHaveBeenCalledWith("/tasks");
			expect(redirect).toHaveBeenCalledWith("/tasks");
		});
	});

	describe("updateTask", () => {
		it("should update an existing task and redirect", async () => {
			const taskId = "task-1";
			const formData = new FormData();
			formData.append("title", "Updated Title");
			formData.append("description", "Updated Description");
			formData.append("dueDate", "2026-01-01");

			await updateTask(taskId, formData);

			expect(taskRepository.updateTask).toHaveBeenCalledWith(taskId, {
				title: "Updated Title",
				description: "Updated Description",
				dueDate: "2026-01-01",
			});
			expect(revalidatePath).toHaveBeenCalledWith("/tasks");
			expect(redirect).toHaveBeenCalledWith("/tasks");
		});
	});

	describe("toggleTaskStatus", () => {
		it("should toggle status from '未完了' to '完了'", async () => {
			const task: Task = {
				taskId: "task-1",
				title: "Test",
				status: "未完了",
				description: "",
				dueDate: "",
			};
			vi.mocked(taskRepository.getTasks).mockReturnValue([task]);

			await toggleTaskStatus("task-1");

			expect(taskRepository.updateTask).toHaveBeenCalledWith("task-1", {
				status: "完了",
			});
			expect(revalidatePath).toHaveBeenCalledWith("/tasks");
		});

		it("should toggle status from '完了' to '未完了'", async () => {
			const task: Task = {
				taskId: "task-1",
				title: "Test",
				status: "完了",
				description: "",
				dueDate: "",
			};
			vi.mocked(taskRepository.getTasks).mockReturnValue([task]);

			await toggleTaskStatus("task-1");

			expect(taskRepository.updateTask).toHaveBeenCalledWith("task-1", {
				status: "未完了",
			});
			expect(revalidatePath).toHaveBeenCalledWith("/tasks");
		});

		it("should not do anything if task is not found", async () => {
			vi.mocked(taskRepository.getTasks).mockReturnValue([]);

			await toggleTaskStatus("not-found-task");

			expect(taskRepository.updateTask).not.toHaveBeenCalled();
			expect(revalidatePath).not.toHaveBeenCalled();
		});
	});

	describe("deleteTask", () => {
		it("should delete a task and revalidate the path", async () => {
			const taskId = "task-1";

			await deleteTask(taskId);

			expect(taskRepository.deleteTask).toHaveBeenCalledWith(taskId);
			expect(revalidatePath).toHaveBeenCalledWith("/tasks");
		});
	});
});
