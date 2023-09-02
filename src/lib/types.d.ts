export interface Todo {
	id: number | null;
	text: string;
	completed: boolean;
}

export interface TodoList {
	id: number;
	title: string;
	todos: Array<Todo>;
}

export interface Note {
	id: number;
	title: string;
	text: string;
}
