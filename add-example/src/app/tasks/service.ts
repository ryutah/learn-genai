import { createTask, getTasks, updateTask } from "@/repositories/task";
import type { Task } from "@/types/task";

/**
 * タスクを全件取得する
 */
export const fetchTasks = async (): Promise<Task[]> => {
	return getTasks();
};

/**
 * 新しいタスクを追加する
 * @param task - 追加するタスク情報
 */
export const addNewTask = async (
	task: Omit<Task, "id" | "status">,
): Promise<Task> => {
	return createTask(task);
};

/**
 * 既存のタスクを更新する
 * @param id - 更新するタスクのID
 * @param partialTask - 更新するタスクの情報
 */
export const updateExistingTask = async (
	id: number,
	partialTask: Partial<Omit<Task, "id">>,
): Promise<Task | undefined> => {
	return updateTask(id, partialTask);
};

/**
 * タスクを完了状態にする
 * @param id - 完了するタスクのID
 */
export const completeTask = async (id: number): Promise<Task | undefined> => {
	return updateTask(id, { status: "complete" });
};
