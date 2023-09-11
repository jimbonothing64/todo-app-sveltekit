import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { taskSlots, todos, todoLists } from '$lib/server/schema';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import {
	deleteSlot,
	getAllArchivedSlots,
	getAllCurrentSlots,
	userCanMutate
} from '$lib/server/taskSlot.db';
import { noteSlotFormSchema } from '$lib/validate';
import { parse } from '$lib/todolist.db';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, '/login');
	const userId = session.user.userId;

	const fetchAllCurrentTodoLists = async () => {
		const allTodos = await getAllCurrentSlots(userId, 'todos');
		return allTodos;
	};

	const fetchAllArchivedTodoLists = async () => {
		const allTodos = await getAllArchivedSlots(userId, 'todos');
		return allTodos;
	};

	return {
		allCurrent: fetchAllCurrentTodoLists(),
		allArchived: fetchAllArchivedTodoLists()
	};
};

export const actions: Actions = {
	updateSlot: async ({ request, locals }) => {
		const session = await locals.auth.validate();
		if (!session) throw redirect(302, '/login');

		const userId = session.user.userId;
		const data = await request.formData();
		const slotId = data.get('slotId');
		const todoId = data.get('todoId');
		const title = data.get('title');
		const archived = data.get('archived') ? true : false;
		const formTodos = parse(data, todoId);

		const canMutate = userCanMutate(slotId, userId);
		if (!canMutate) {
			return { message: 'Can only edit own notes!' };
		}
		const resultSlot = await db.update(taskSlots).set({ archived }).where(eq(taskSlots.id, slotId));
		const resultTodoList = await db
			.update(todoLists)
			.set({ title })
			.where(eq(todoLists.id, todoId));

		const resultTodos = true;
		const queue = [];
		for (const todo of formTodos) {
			const { id, todo_list_id, ...rest } = todo;

			queue.push(
				db
					.update(todos)
					.set({ ...rest })
					.where(eq(todos.id, id))
			);
		}
		await Promise.all(queue);

		const success = !!resultTodoList && !!resultSlot && resultTodos;
		return { success };
	},

	deleteSlot: async ({ request, locals }) => {
		const session = await locals.auth.validate();
		if (!session) throw redirect(302, '/login');
		const userId = session.user.userId;

		const data = await request.formData();
		const delteSlotId = data.get('id');
		const deleteNoteId = data.get('noteId');
		const deleteTodoListId = data.get('todoListId');

		const result = await deleteSlot(delteSlotId, deleteNoteId, deleteTodoListId, todoId);
		const success = !!result;
		return { success };
	}
};
