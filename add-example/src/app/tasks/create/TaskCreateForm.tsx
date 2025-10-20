"use client";

import { Box, Button, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { createTask } from "../service";

const SubmitButton = () => {
	const { pending } = useFormStatus();
	return (
		<Button
			type="submit"
			variant="contained"
			color="primary"
			disabled={pending}
		>
			{pending ? "登録中..." : "登録"}
		</Button>
	);
};

export const TaskCreateForm = () => {
	const router = useRouter();

	return (
		<form action={createTask}>
			<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
				<TextField label="タイトル" name="title" required fullWidth />
				<TextField
					label="詳細"
					name="description"
					multiline
					rows={4}
					fullWidth
				/>
				<TextField
					label="期限日"
					name="dueDate"
					type="date"
					slotProps={{
						inputLabel: { shrink: true },
					}}
					fullWidth
				/>
				<Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
					<Button type="button" onClick={() => router.push("/tasks")}>
						キャンセル
					</Button>
					<SubmitButton />
				</Box>
			</Box>
		</form>
	);
};
