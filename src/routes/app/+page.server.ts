import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { todoLists, todos, taskSlots, notes } from '$lib/server/schema';
import type { NewSlotType, Todo } from '$lib/types';
import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, '/login');

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
		userId: session.user.userId,
		username: session.user.username,
		allTaskSlots: fetchAllTaskSlots()
	};
};

export const actions: Actions = {
	createSlot: async ({ request }) => {
		const data = await request.formData();
		console.log(data.keys());
		const title = data.get('title');
		const type: NewSlotType = data.get('type') || 'note';
		const toInsert = {
			title
		};
		if (!title) return { success: false };

		if (type === 'todo list') {
			const newTodoLists = await db.insert(todoLists).values(toInsert);
			const newTodoListid = newTodoLists.insertId;

			const newTodos = {};
			for (const key of data.keys()) {
				if (key.startsWith('todo.')) {
					const [_, ordering, type] = key.split('.');
					if (!newTodos[ordering]) {
						newTodos[ordering] = { ordering, todo_list_id: newTodoListid };
					}
					if (type == 'completed') {
						newTodos[ordering][type] = data.get(key) === 'true' ? true : false;
					} else {
						if (data.get(key)) {
							newTodos[ordering][type] = data.get(key);
						}
					}
				}
			}
			const insertTodos = Object.values(newTodos);
			await db.insert(todos).values(insertTodos);

			await db.insert(taskSlots).values({ todo_list_id: newTodoListid });
		} else if (type === 'note') {
			const text = data.get('text');
			const newNotes = await db.insert(notes).values({ title, text });
			await db.insert(taskSlots).values({ note_id: newNotes.insertId });
		}

		return { success: true };
	},

	createTodoList: async ({ request }) => {
		const data = await request.formData();
		const title = data.get('title');
		const toInsert = {
			title
		};
		console.log(toInsert);
		console.log(data);
		if (!title) return { success: false };

		const todoListss = await db.insert(todoLists).values(toInsert);
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
