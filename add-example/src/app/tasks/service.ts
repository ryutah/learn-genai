"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as taskRepository from "@/repositories/task";
import type { Task } from "@/types/task";

/**
 * 新しいタスクを作成する Server Action
 */
export const createTask = async (formData: FormData) => {
	const data = {
		title: formData.get("title") as string,
		description: formData.get("description") as string,
		dueDate: formData.get("dueDate") as string,
	};
	taskRepository.createTask({
		...data,
		status: "未完了",
	});
	revalidatePath("/tasks");
	redirect("/tasks");
};

/**
 * 既存のタスクを更新する Server Action
 */
export const updateTask = async (taskId: string, formData: FormData) => {
	const data = {
		title: formData.get("title") as string,
		description: formData.get("description") as string,
		dueDate: formData.get("dueDate") as string,
	};
	taskRepository.updateTask(taskId, data);
	revalidatePath("/tasks");
	redirect("/tasks");
};

/**
 * タスクの完了状態を切り替える Server Action
 */
export const toggleTaskStatus = async (taskId: string) => {
	const task = taskRepository.getTasks().find((t) => t.taskId === taskId);
	if (task) {
		const newStatus = task.status === "完了" ? "未完了" : "完了";
		taskRepository.updateTask(taskId, { status: newStatus });
		revalidatePath("/tasks");
	}
};

/**
 * タスクを削除する Server Action
 */
export const deleteTask = async (taskId: string) => {
	taskRepository.deleteTask(taskId);
	revalidatePath("/tasks");
};
