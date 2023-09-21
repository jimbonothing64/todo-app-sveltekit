import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { taskSlots, todos, todoLists } from '$lib/server/schema';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { getAllArchivedSlots, getAllCurrentSlots, userCanMutate } from '$lib/server/taskSlot.db';
import {
	newTodoListSlotFormSchema,
	parseTodosForm,
	todoListSlotFormSchema
} from '$lib/validate/todo';

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
	createSlot: async ({ request, locals }) => {
		const session = await locals.auth.validate();
		if (!session) throw redirect(302, '/login');
		const userId = session.user.userId;

		const data = await request.formData();
		const slotResult = newTodoListSlotFormSchema.safeParse(data);
		if (!slotResult.success) {
			const errors = {
				fieldErrors: slotResult.error.flatten().fieldErrors
			};
			return fail(400, errors);
		}

		const toInsert = slotResult.data;
		const newTodoListid = parseInt((await db.insert(todoLists).values(toInsert)).insertId);

		const insertTodos = parseTodosForm(data, newTodoListid).new;
		await db.insert(todos).values(insertTodos);
		await db.insert(taskSlots).values({ todo_list_id: newTodoListid, user_id: userId });
		return { success: true };
	},

	updateSlot: async ({ request, locals }) => {
		const session = await locals.auth.validate();
		if (!session) throw redirect(302, '/login');

		const userId = session.user.userId;
		const data = await request.formData();

		const slotResult = todoListSlotFormSchema.safeParse(data);
		if (!slotResult.success) {
			const errors = {
				fieldErrors: slotResult.error.flatten().fieldErrors
			};
			return fail(400, errors);
		}
		const { slotId, todoId, title, archived } = slotResult.data;
		const parsedTodos = parseTodosForm(data, todoId);
		const updatedTodos = parsedTodos.existing;
		const deleteTodos = parsedTodos.delete;
		const newTodos = parsedTodos.new;
		const canMutate = userCanMutate(slotId, userId);
		if (!canMutate) {
			return { message: 'Can only edit own todos!' };
		}
		const resultSlot = await db.update(taskSlots).set({ archived }).where(eq(taskSlots.id, slotId));
		const resultTodoList = await db
			.update(todoLists)
			.set({ title })
			.where(eq(todoLists.id, todoId));

		if (newTodos.length > 0) {
			await db.insert(todos).values(newTodos);
		}

		const resultTodos = true;
		const queue = [];
		for (const todo of updatedTodos) {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { id, todo_list_id, ...rest } = todo;

			queue.push(
				db
					.update(todos)
					.set({ ...rest })
					.where(eq(todos.id, id))
			);
		}
		for (const todo of deleteTodos) {
			queue.push(db.delete(todos).where(eq(todos.id, parseInt(todo.id))));
		}
		await Promise.all(queue);

		const success = !!resultTodoList && !!resultSlot && resultTodos;
		return { success };
	}
};
