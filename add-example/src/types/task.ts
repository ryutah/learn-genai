export type Task = {
	id: number;
	title: string;
	details: string;
	dueDate: string;
	status: "incomplete" | "complete";
};
