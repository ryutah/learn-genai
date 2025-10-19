"use client";

import { List, Typography } from "@mui/material";
import type { Task } from "@/types/task";
import { TaskItem } from "./TaskItem";

type Props = {
	tasks: Task[];
	isLoading: boolean;
	onToggleComplete: (id: number, status: Task["status"]) => Promise<void>;
};

export function TaskList({ tasks, isLoading, onToggleComplete }: Props) {
	if (isLoading) {
		return <Typography>Loading...</Typography>;
	}

	return (
		<List>
			{tasks.map((task) => (
				<TaskItem
					key={task.id}
					task={task}
					onToggleComplete={onToggleComplete}
				/>
			))}
		</List>
	);
}
