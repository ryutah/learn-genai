import { Box, Container, Typography } from "@mui/material";
import { TaskCreateForm } from "./TaskCreateForm";

const TaskCreatePage = () => {
	return (
		<Container maxWidth="sm">
			<Box sx={{ my: 4 }}>
				<Typography variant="h4" component="h1" gutterBottom>
					タスク新規登録 (Server Component)
				</Typography>
				<TaskCreateForm />
			</Box>
		</Container>
	);
};

export default TaskCreatePage;
