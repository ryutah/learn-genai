// specs/models/information_model.yml と rdra/STA_01_state_model.puml に基づく

/**
 * タスクの状態
 * - 未完了
 * - 完了
 */
export type TaskStatus = "未完了" | "完了";

/**
 * ENT_01: タスク
 * ユーザーが管理するタスク
 */
export type Task = {
	/**
	 * @PK
	 */
	taskId: string;
	title: string;
	description: string;
	dueDate: string;
	status: TaskStatus;
};
