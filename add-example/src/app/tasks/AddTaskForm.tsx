"use client";

import { Box, Button, FormControl, TextField } from "@mui/material";
import { useState } from "react";

type Props = {
	onAddTask: (title: string) => Promise<void>;
};

export function AddTaskForm({ onAddTask }: Props) {
	const [title, setTitle] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!title.trim()) return;
		await onAddTask(title);
		setTitle("");
	};

	return (
		<Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
			<FormControl fullWidth>
				<TextField
					label="New Task Title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					variant="outlined"
				/>
			</FormControl>
			<Button type="submit" variant="contained" sx={{ mt: 2 }}>
				Add Task
			</Button>
		</Box>
	);
}
