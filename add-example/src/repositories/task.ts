import { randomUUID } from "node:crypto";
import type { Task } from "@/types/task";

// DBの代わりとなるメモリ上のストア
let tasks: Task[] = [];

/**
 * すべてのタスクを取得します。
 * @returns タスクの配列
 */
export const getTasks = (): Task[] => {
	return tasks;
};

/**
 * 新しいタスクを作成します。
 * @param taskData - taskId を除くタスク情報
 * @returns 作成されたタスク
 */
export const createTask = (taskData: Omit<Task, "taskId">): Task => {
	const newTask: Task = {
		taskId: randomUUID(),
		...taskData,
	};
	tasks.push(newTask);
	return newTask;
};

/**
 * 既存のタスクを更新します。
 * @param taskId - 更新するタスクのID
 * @param updates - 更新する情報
 * @returns 更新されたタスク、またはタスクが見つからない場合は undefined
 */
export const updateTask = (
	taskId: string,
	updates: Partial<Omit<Task, "taskId">>,
): Task | undefined => {
	const taskIndex = tasks.findIndex((t) => t.taskId === taskId);
	if (taskIndex === -1) {
		return undefined;
	}

	const updatedTask = {
		...tasks[taskIndex],
		...updates,
	};
	tasks[taskIndex] = updatedTask;
	return updatedTask;
};

/**
 * タスクを削除します。
 * @param taskId - 削除するタスクのID
 * @returns 削除が成功した場合は true、失敗した場合は false
 */
export const deleteTask = (taskId: string): boolean => {
	const initialLength = tasks.length;
	tasks = tasks.filter((t) => t.taskId !== taskId);
	return tasks.length < initialLength;
};

/**
 * (テスト用) タスク配列をリセットします。
 */
export const _resetTasks = (): void => {
	tasks = [];
};
