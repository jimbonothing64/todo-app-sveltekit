import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { todoLists, todos, taskSlots, notes } from '$lib/server/schema';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const fetchAllTodoLists = async () => {
		const allTodoLists = await db.query.todoLists.findMany({
			with: {
				todos: true
			}
		});
		return allTodoLists;
	};

	const fetchAllNotes = async () => {
		const allTodoLists = await db.query.notes.findMany({});
		return allTodoLists;
	};

	const fetchAllTaskSlots = async () => {
		const allTodoLists = await db.query.taskSlots.findMany({
			with: {
				todoList: {
					with: {
						todos: true
					}
				},
				note: true
			}
		});
		return allTodoLists;
	};

	return {
		allTaskSlots: fetchAllTaskSlots()
	};
};

export const actions: Actions = {
	createTodoList: async ({ request }) => {
		const data = await request.formData();
		const title = data.get('title');
		if (!title) return { success: false };

		const todoListss = await db.insert(todoLists).values({ title: title });
		console.log(todoListss);
		console.log(todoListss.insertId);
		await db.insert(taskSlots).values({ todo_list_id: todoListss.insertId });
		return { success: true };
	},

	createNote: async ({ request }) => {
		const data = await request.formData();
		const title = data.get('title');
		const text = data.get('text');
		if (!title) return { success: false };

		const todoListss = await db.insert(notes).values({ title, text });
		console.log(todoListss);
		console.log(todoListss.insertId);
		await db.insert(taskSlots).values({ note_id: todoListss.insertId });
		return { success: true };
	},

	deleteTodoList: async ({ request }) => {
		const data = await request.formData();
		const delteId = data.get('id');
		console.log(delteId);
		if (!delteId) return;

		await db.delete(todos).where(eq(todo.todo_list_id, delteId));
		await db.delete(todoLists).where(eq(todoLists.id, delteId));
		return { success: true };
	},

	deleteTaskSlot: async ({ request }) => {
		const data = await request.formData();
		const delteSlotId = data.get('id');
		const deleteNoteId = data.get('noteId');
		const deleteTodoListId = data.get('todoListId');

		console.log(delteSlotId);
		console.log(deleteTodoListId);
		if (!delteSlotId) return;
		if (deleteTodoListId) {
			await db.delete(todos).where(eq(todos.todo_list_id, deleteTodoListId));
			await db.delete(todoLists).where(eq(todoLists.id, deleteTodoListId));
		}
		if (deleteNoteId) {
			await db.delete(notes).where(eq(notes.id, deleteNoteId));
		}

		await db.delete(taskSlots).where(eq(taskSlots.id, delteSlotId));
		return { success: true };
	},

	createTodo: async ({ request }) => {
		const data = await request.formData();
		const text = data.get('text');
		const todoListId = data.get('id');
		console.log(text, todoListId);
		if (text !== '') {
			await db.insert(todos).values({ text: text, todo_list_id: todoListId });
			return { success: true };
		}
		return { success: false };
	}
};
