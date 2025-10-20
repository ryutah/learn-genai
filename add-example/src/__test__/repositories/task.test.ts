import { beforeEach, describe, expect, it } from "vitest";
import {
	_resetTasks, // テスト用のリセット関数
	createTask,
	deleteTask,
	getTasks,
	updateTask,
} from "@/repositories/task";
import type { Task } from "@/types/task";

describe("task repository", () => {
	beforeEach(() => {
		_resetTasks();
	});

	it("createTask: 新しいタスクを作成できる", () => {
		const newTask: Omit<Task, "taskId"> = {
			title: "新しいタスク",
			description: "これは新しいタスクです",
			dueDate: "2025-12-31",
			status: "未完了",
		};
		const createdTask = createTask(newTask);
		expect(createdTask).toHaveProperty("taskId");
		expect(createdTask.title).toBe(newTask.title);

		const tasks = getTasks();
		expect(tasks).toHaveLength(1);
		expect(tasks[0]).toEqual(createdTask);
	});

	it("getTasks: すべてのタスクを取得できる", () => {
		createTask({
			title: "タスク1",
			description: "",
			dueDate: "2025-01-01",
			status: "未完了",
		});
		createTask({
			title: "タスク2",
			description: "",
			dueDate: "2025-01-02",
			status: "完了",
		});

		const tasks = getTasks();
		expect(tasks).toHaveLength(2);
	});

	it("updateTask: 既存のタスクを更新できる", () => {
		const createdTask = createTask({
			title: "更新前のタスク",
			description: "説明",
			dueDate: "2025-01-01",
			status: "未完了",
		});

		const updates: Partial<Task> = {
			title: "更新後のタスク",
			status: "完了",
		};

		const updatedTask = updateTask(createdTask.taskId, updates);

		expect(updatedTask).toBeDefined();
		if (!updatedTask) return;

		expect(updatedTask.title).toBe("更新後のタスク");
		expect(updatedTask.status).toBe("完了");
		expect(updatedTask.description).toBe("説明"); // 変更されていないプロパティはそのまま

		const task = getTasks().find((t) => t.taskId === createdTask.taskId);
		expect(task?.title).toBe("更新後のタスク");
	});

	it("updateTask: 存在しないタスクを更新しようとするとundefinedを返す", () => {
		const updatedTask = updateTask("non-existent-id", { title: "存在しない" });
		expect(updatedTask).toBeUndefined();
	});

	it("deleteTask: 既存のタスクを削除できる", () => {
		const task1 = createTask({
			title: "タスク1",
			description: "",
			dueDate: "2025-01-01",
			status: "未完了",
		});
		const task2 = createTask({
			title: "タスク2",
			description: "",
			dueDate: "2025-01-02",
			status: "完了",
		});

		const result = deleteTask(task1.taskId);
		expect(result).toBe(true);

		const tasks = getTasks();
		expect(tasks).toHaveLength(1);
		expect(tasks[0].taskId).toBe(task2.taskId);
	});

	it("deleteTask: 存在しないタスクを削除しようとするとfalseを返す", () => {
		const result = deleteTask("non-existent-id");
		expect(result).toBe(false);
	});
});
