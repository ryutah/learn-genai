import { Box, Button, Container, Typography } from "@mui/material";
import Link from "next/link";
import * as taskRepository from "@/repositories/task";
import { deleteTask, toggleTaskStatus } from "./service";
import { TaskList } from "./TaskList";

const TasksPage = () => {
	const tasks = taskRepository.getTasks();

	return (
		<Container>
			<Box sx={{ my: 4 }}>
				<Typography variant="h4" component="h1" gutterBottom>
					タスク一覧 (Server Component)
				</Typography>
				<Button
					variant="contained"
					color="primary"
					component={Link}
					href="/tasks/create"
					sx={{ mb: 2 }}
				>
					新規登録
				</Button>
				<TaskList
					tasks={tasks}
					onToggleStatusAction={toggleTaskStatus}
					onDeleteAction={deleteTask}
				/>
			</Box>
		</Container>
	);
};

export default TasksPage;
