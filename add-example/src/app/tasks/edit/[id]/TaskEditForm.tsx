"use client";

import { Box, Button, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { deleteTask, updateTask } from "@/app/tasks/service";
import type { Task } from "@/types/task";

const SubmitButton = () => {
	const { pending } = useFormStatus();
	return (
		<Button
			type="submit"
			variant="contained"
			color="primary"
			disabled={pending}
		>
			{pending ? "更新中..." : "更新"}
		</Button>
	);
};

type TaskEditFormProps = {
	task: Task;
};

export const TaskEditForm = ({ task }: TaskEditFormProps) => {
	const router = useRouter();
	const updateTaskWithId = updateTask.bind(null, task.taskId);

	return (
		<form action={updateTaskWithId}>
			<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
				<TextField
					label="タイトル"
					name="title"
					defaultValue={task.title}
					required
					fullWidth
				/>
				<TextField
					label="詳細"
					name="description"
					defaultValue={task.description}
					multiline
					rows={4}
					fullWidth
				/>
				<TextField
					label="期限日"
					name="dueDate"
					type="date"
					defaultValue={task.dueDate}
					slotProps={{
						inputLabel: { shrink: true },
					}}
					fullWidth
				/>
				<Box sx={{ display: "flex", justifyContent: "space-between" }}>
					<Button
						type="button"
						onClick={async () => {
							if (confirm("本当に削除しますか？")) {
								await deleteTask(task.taskId);
								router.push("/tasks");
							}
						}}
						color="error"
					>
						削除
					</Button>
					<Box>
						<Button
							type="button"
							onClick={() => router.push("/tasks")}
							sx={{ mr: 1 }}
						>
							キャンセル
						</Button>
						<SubmitButton />
					</Box>
				</Box>
			</Box>
		</form>
	);
};
