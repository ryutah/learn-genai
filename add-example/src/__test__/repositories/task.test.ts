import { beforeEach, describe, expect, it, vi } from "vitest";

// モジュールが状態を持つため、テストごとにリセットするために動的インポートを使用
const importRepo = async () => {
	const { getTasks, createTask, updateTask } = await import(
		"@/repositories/task"
	);
	return { getTasks, createTask, updateTask };
};

describe("Task Repository", () => {
	beforeEach(async () => {
		// モジュールキャッシュをリセットして、テストごとに独立した状態を保証する
		vi.resetModules();
	});

	it("初期状態で2件のタスクが取得できること", async () => {
		const { getTasks } = await importRepo();
		const tasks = await getTasks();
		expect(tasks).toHaveLength(2);
		expect(tasks[0].title).toBe("RDRAの資料を確認する");
	});

	it("新しいタスクを1件作成できること", async () => {
		const { getTasks, createTask } = await importRepo();
		const newTask = {
			title: "新しいタスク",
			details: "詳細",
			dueDate: "2025-10-21",
		};
		const createdTask = await createTask(newTask);

		expect(createdTask.id).toBe(3);
		expect(createdTask.title).toBe("新しいタスク");
		expect(createdTask.status).toBe("incomplete");

		const tasks = await getTasks();
		expect(tasks).toHaveLength(3);
	});

	it("既存のタスクを更新できること", async () => {
		const { getTasks, updateTask } = await importRepo();
		const updated = await updateTask(1, { title: "更新されたタイトル" });

		expect(updated?.id).toBe(1);
		expect(updated?.title).toBe("更新されたタイトル");

		const tasks = await getTasks();
		const target = tasks.find((t) => t.id === 1);
		expect(target?.title).toBe("更新されたタイトル");
	});

	it("存在しないタスクを更新しようとした場合、undefinedが返ること", async () => {
		const { updateTask } = await importRepo();
		const result = await updateTask(999, { title: "存在しない" });
		expect(result).toBeUndefined();
	});
});
