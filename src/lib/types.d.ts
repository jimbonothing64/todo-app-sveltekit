export interface Todo {
	id: number | null;
	text: string;
	completed: boolean;
}

export interface TodoList {
	id: number | null;
	title: string;
	todos: Array<Todo>;
}

export interface Note {
	id: number | null;
	title: string;
	text: string;
}

export type NewSlotType = 'note' | 'todo list';
