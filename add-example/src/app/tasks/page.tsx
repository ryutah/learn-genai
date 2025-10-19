"use client";

import { Container, Typography } from "@mui/material";
import { useEffect, useReducer } from "react";
import type { Task } from "@/types/task";
import { AddTaskForm } from "./AddTaskForm";
import { addNewTask, fetchTasks, updateExistingTask } from "./service";
import { TaskList } from "./TaskList";

// useReducer のための型定義
type State = {
	tasks: Task[];
	isLoading: boolean;
};

type Action =
	| { type: "SET_TASKS"; payload: Task[] }
	| { type: "ADD_TASK"; payload: Task }
	| { type: "UPDATE_TASK"; payload: Task };

const initialState: State = {
	tasks: [],
	isLoading: true,
};

const reducer = (state: State, action: Action): State => {
	switch (action.type) {
		case "SET_TASKS":
			return { ...state, tasks: action.payload, isLoading: false };
		case "ADD_TASK":
			return { ...state, tasks: [...state.tasks, action.payload] };
		case "UPDATE_TASK":
			return {
				...state,
				tasks: state.tasks.map((task) =>
					task.id === action.payload.id ? action.payload : task,
				),
			};
		default:
			return state;
	}
};

// Container Component
export default function TasksPage() {
	const [state, dispatch] = useReducer(reducer, initialState);

	useEffect(() => {
		fetchTasks().then((tasks) => {
			dispatch({ type: "SET_TASKS", payload: tasks });
		});
	}, []);

	const handleAddTask = async (title: string) => {
		const newTask = await addNewTask({ title, details: "", dueDate: "" });
		dispatch({ type: "ADD_TASK", payload: newTask });
	};

	const handleToggleComplete = async (id: number, status: Task["status"]) => {
		const newStatus = status === "complete" ? "incomplete" : "complete";
		const updatedTask = await updateExistingTask(id, { status: newStatus });
		if (updatedTask) {
			dispatch({ type: "UPDATE_TASK", payload: updatedTask });
		}
	};

	return (
		<Container maxWidth="md">
			<Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
				Todo List
			</Typography>

			<AddTaskForm onAddTask={handleAddTask} />

			<TaskList
				tasks={state.tasks}
				isLoading={state.isLoading}
				onToggleComplete={handleToggleComplete}
			/>
		</Container>
	);
}
