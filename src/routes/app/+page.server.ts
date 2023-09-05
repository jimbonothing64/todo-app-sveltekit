import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { todoLists, todos, taskSlots, notes } from '$lib/server/schema';
import type { NewSlotType, Todo } from '$lib/types';
import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { deleteSlot } from '$lib/server/taskSlot.db';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, '/login');
	const userId = session.user.userId;

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
			},
			where: (taskSlots, { eq }) => eq(taskSlots.user_id, userId)
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
	createSlot: async ({ request, locals }) => {
		const session = await locals.auth.validate();
		if (!session) throw redirect(302, '/login');
		const userId = session.user.userId;

		const data = await request.formData();
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
						newTodos[ordering][type] = data.get(key) === 'on' ? true : false;
					} else {
						if (data.get(key)) {
							newTodos[ordering][type] = data.get(key);
						}
					}
				}
			}
			const insertTodos = Object.values(newTodos);
			await db.insert(todos).values(insertTodos);

			await db.insert(taskSlots).values({ todo_list_id: newTodoListid, user_id: userId });
		} else if (type === 'note') {
			const text = data.get('text');
			const newNotes = await db.insert(notes).values({ title, text });
			await db.insert(taskSlots).values({ note_id: newNotes.insertId, user_id: userId });
		}

		return { success: true };
	},

	createTodoList: async ({ request }) => {
		const data = await request.formData();
		const title = data.get('title');
		const toInsert = {
			title
		};
		if (!title) return { success: false };

		const todoListss = await db.insert(todoLists).values(toInsert);
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
		if (!delteId) return;

		await db.delete(todos).where(eq(todos.todo_list_id, delteId));
		await db.delete(todoLists).where(eq(todoLists.id, delteId));
		return { success: true };
	},

	deleteTaskSlot: async ({ request, locals }) => {
		const session = await locals.auth.validate();
		if (!session) throw redirect(302, '/login');
		const userId = session.user.userId;

		const data = await request.formData();
		const delteSlotId = data.get('id');
		const deleteNoteId = data.get('noteId');
		const deleteTodoListId = data.get('todoListId');

		const success = await deleteSlot(delteSlotId, deleteNoteId, deleteTodoListId, userId);
		return { success };
	},

	createTodo: async ({ request }) => {
		const data = await request.formData();
		const text = data.get('text');
		const todoListId = data.get('id');
		if (text !== '') {
			await db.insert(todos).values({ text: text, todo_list_id: todoListId });
			return { success: true };
		}
		return { success: false };
	}
};
