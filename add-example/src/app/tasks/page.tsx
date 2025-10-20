"use client";

import { Box, Button, Container, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as taskRepository from "@/repositories/task";
import type { Task } from "@/types/task";
import { TaskList } from "./TaskList";

const TasksPage = () => {
	const router = useRouter();
	const [tasks, setTasks] = useState<Task[]>([]);

	// 初期データ投入 (テスト用)
	useEffect(() => {
		if (taskRepository.getTasks().length === 0) {
			taskRepository.createTask({
				title: "Next.jsの学習",
				description: "App Routerを理解する",
				dueDate: "2025-12-01",
				status: "未完了",
			});
			taskRepository.createTask({
				title: "MUIの調査",
				description: "v7の新機能を確認する",
				dueDate: "2025-11-30",
				status: "完了",
			});
		}
		setTasks(taskRepository.getTasks());
	}, []);

	const handleToggleStatus = (taskId: string) => {
		const task = tasks.find((t) => t.taskId === taskId);
		if (task) {
			const newStatus = task.status === "完了" ? "未完了" : "完了";
			taskRepository.updateTask(taskId, { status: newStatus });
			setTasks(taskRepository.getTasks());
		}
	};

	const handleEdit = (taskId: string) => {
		// TODO: 編集ページへの遷移
		console.log("Edit:", taskId);
	};

	const handleDelete = (taskId: string) => {
		taskRepository.deleteTask(taskId);
		setTasks(taskRepository.getTasks());
	};

	const handleCreate = () => {
		// TODO: 作成ページへの遷移
		console.log("Create new task");
	};

	return (
		<Container>
			<Box sx={{ my: 4 }}>
				<Typography variant="h4" component="h1" gutterBottom>
					タスク一覧
				</Typography>
				<Button
					variant="contained"
					color="primary"
					onClick={handleCreate}
					sx={{ mb: 2 }}
				>
					新規登録
				</Button>
				<TaskList
					tasks={tasks}
					onToggleStatus={handleToggleStatus}
					onEdit={handleEdit}
					onDelete={handleDelete}
				/>
			</Box>
		</Container>
	);
};

export default TasksPage;
