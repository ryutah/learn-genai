import { Box, Container, Typography } from "@mui/material";
import * as taskRepository from "@/repositories/task";
import { TaskEditForm } from "./TaskEditForm";

type PageProps = {
	params: {
		id: string;
	};
};

const TaskEditPage = ({ params }: PageProps) => {
	const task = taskRepository.getTasks().find((t) => t.taskId === params.id);

	if (!task) {
		return (
			<Container maxWidth="sm">
				<Box sx={{ my: 4 }}>
					<Typography variant="h5" component="h2">
						タスクが見つかりません
					</Typography>
				</Box>
			</Container>
		);
	}

	return (
		<Container maxWidth="sm">
			<Box sx={{ my: 4 }}>
				<Typography variant="h4" component="h1" gutterBottom>
					タスク編集 (Server Component)
				</Typography>
				<TaskEditForm task={task} />
			</Box>
		</Container>
	);
};

export default TaskEditPage;
