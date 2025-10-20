"use client";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
	Checkbox,
	IconButton,
	List,
	ListItem,
	ListItemText,
	Typography,
} from "@mui/material";
import type { Task } from "@/types/task";

type TaskListProps = {
	tasks: Task[];
	onToggleStatus: (taskId: string) => void;
	onEdit: (taskId: string) => void;
	onDelete: (taskId: string) => void;
};

export const TaskList = ({
	tasks,
	onToggleStatus,
	onEdit,
	onDelete,
}: TaskListProps) => {
	if (tasks.length === 0) {
		return <Typography>タスクがありません。</Typography>;
	}

	return (
		<List>
			{tasks.map((task) => (
				<ListItem
					key={task.taskId}
					secondaryAction={
						<>
							<IconButton
								edge="end"
								aria-label="編集"
								onClick={() => onEdit(task.taskId)}
							>
								<EditIcon />
							</IconButton>
							<IconButton
								edge="end"
								aria-label="削除"
								onClick={() => onDelete(task.taskId)}
							>
								<DeleteIcon />
							</IconButton>
						</>
					}
					disablePadding
				>
					<Checkbox
						edge="start"
						checked={task.status === "完了"}
						onChange={() => onToggleStatus(task.taskId)}
						tabIndex={-1}
						disableRipple
					/>
					<ListItemText
						primary={task.title}
						secondary={task.dueDate}
						style={{
							textDecoration: task.status === "完了" ? "line-through" : "none",
						}}
					/>
				</ListItem>
			))}
		</List>
	);
};
