"use client";

import EditIcon from "@mui/icons-material/Edit";
import {
	Checkbox,
	IconButton,
	ListItem,
	ListItemSecondaryAction,
	ListItemText,
} from "@mui/material";
import type { Task } from "@/types/task";

type Props = {
	task: Task;
	onToggleComplete: (id: number, status: Task["status"]) => Promise<void>;
};

export function TaskItem({ task, onToggleComplete }: Props) {
	return (
		<ListItem dense>
			<Checkbox
				edge="start"
				checked={task.status === "complete"}
				tabIndex={-1}
				disableRipple
				onChange={() => onToggleComplete(task.id, task.status)}
			/>
			<ListItemText
				primary={task.title}
				s={{
					textDecoration: task.status === "complete" ? "line-through" : "none",
					color: task.status === "complete" ? "text.disabled" : "text.primary",
				}}
			/>
			<ListItemSecondaryAction>
				<IconButton edge="end" aria-label="edit">
					<EditIcon />
				</IconButton>
			</ListItemSecondaryAction>
		</ListItem>
	);
}
