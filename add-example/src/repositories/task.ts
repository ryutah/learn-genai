import type { Task } from "@/types/task";

// インメモリでのデータストアを模倣
const tasks: Task[] = [
	{
		id: 1,
		title: "RDRAの資料を確認する",
		details: "GEMINI.md を読んで、プロジェクトの全体像を把握する。",
		dueDate: "2025-10-19",
		status: "complete",
	},
	{
		id: 2,
		title: "エンティティの型定義を実装する",
		details: "src/types/task.ts を作成する。",
		dueDate: "2025-10-20",
		status: "incomplete",
	},
];

// IDの自動採番を模倣
let nextId = tasks.length + 1;

/**
 * すべてのタスクを取得する
 */
export const getTasks = async (): Promise<Task[]> => {
	// 実際のアプリケーションではAPIやDBからの非同期な取得を想定
	return Promise.resolve(tasks);
};

/**
 * 新しいタスクを作成する
 * @param task - idとstatusを除いたタスク情報
 */
export const createTask = async (
	task: Omit<Task, "id" | "status">,
): Promise<Task> => {
	const newTask: Task = {
		id: nextId++,
		...task,
		status: "incomplete",
	};
	tasks.push(newTask);
	return Promise.resolve(newTask);
};

/**
 * 既存のタスクを更新する
 * @param id - 更新対象のタスクID
 * @param partialTask - 更新するタスク情報（一部）
 */
export const updateTask = async (
	id: number,
	partialTask: Partial<Omit<Task, "id">>,
): Promise<Task | undefined> => {
	const taskIndex = tasks.findIndex((t) => t.id === id);
	if (taskIndex === -1) {
		return undefined;
	}
	const updatedTask = { ...tasks[taskIndex], ...partialTask };
	tasks[taskIndex] = updatedTask;
	return Promise.resolve(updatedTask);
};
