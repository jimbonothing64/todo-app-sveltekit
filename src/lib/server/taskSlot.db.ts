import { db } from './db';
import { eq } from 'drizzle-orm';
import { todos, todoLists, notes, taskSlots } from './schema';

export const userCanMutate = async (slotId: number, reqUserId: string) => {
	const theSlot = await db.query.taskSlots.findFirst({
		where: (taskSlots, { eq, and }) =>
			and(eq(taskSlots.id, slotId), eq(taskSlots.user_id, reqUserId))
	});
	return !!theSlot;
};

export const deleteSlot = async (
	slotId: number,
	noteId: number,
	todoId: number,
	reqUserId: string
) => {
	const userMutate = await userCanMutate(slotId, reqUserId);
	let queue: Array<Promise<unknown>> = [];
	if (!slotId || !userMutate) return false;
	if (todoId) {
		queue = [
			db.delete(todos).where(eq(todos.todo_list_id, todoId)),
			db.delete(todoLists).where(eq(todoLists.id, todoId))
		];
	}
	if (noteId) {
		queue.push(db.delete(notes).where(eq(notes.id, noteId)));
	}

	queue.push(db.delete(taskSlots).where(eq(taskSlots.id, slotId)));
	await Promise.all(queue);
	return true;
};

export const getAllSlots = async (userId: string, type: 'notes' | 'todos' | 'all') => {
	let allSlots;

	switch (type) {
		case 'notes':
			allSlots = await db.query.taskSlots.findMany({
				with: {
					note: true
				},
				where: (taskSlots, { eq }) => eq(taskSlots.user_id, userId)
			});
			break;
		case 'todos':
			allSlots = await db.query.taskSlots.findMany({
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
			break;
		case 'all':
			allSlots = await db.query.taskSlots.findMany({
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
			break;
	}
	return allSlots;
};

export const getAllCurrentSlots = async (userId: string, type: 'notes' | 'todos' | 'all') => {
	let allSlots;

	switch (type) {
		case 'notes':
			allSlots = await db.query.taskSlots.findMany({
				with: {
					note: true
				},
				where: (taskSlots, { and, eq }) =>
					and(eq(taskSlots.user_id, userId), eq(taskSlots.archived, false))
			});
			break;
		case 'todos':
			allSlots = await db.query.taskSlots.findMany({
				with: {
					todoList: {
						with: {
							todos: true
						}
					},
					note: true
				},
				where: (taskSlots, { and, eq }) =>
					and(eq(taskSlots.user_id, userId), eq(taskSlots.archived, false))
			});
			break;
		case 'all':
			allSlots = await db.query.taskSlots.findMany({
				with: {
					todoList: {
						with: {
							todos: true
						}
					},
					note: true
				},
				where: (taskSlots, { and, eq }) =>
					and(eq(taskSlots.user_id, userId), eq(taskSlots.archived, false))
			});
			break;
	}
	return allSlots;
};

export const getAllArchivedSlots = async (userId: string, type: 'notes' | 'todos' | 'all') => {
	let allSlots;

	switch (type) {
		case 'notes':
			allSlots = await db.query.taskSlots.findMany({
				with: {
					note: true
				},
				where: (taskSlots, { and, eq }) =>
					and(eq(taskSlots.user_id, userId), eq(taskSlots.archived, true))
			});
			break;
		case 'todos':
			allSlots = await db.query.taskSlots.findMany({
				with: {
					todoList: {
						with: {
							todos: true
						}
					},
					note: true
				},
				where: (taskSlots, { and, eq }) =>
					and(eq(taskSlots.user_id, userId), eq(taskSlots.archived, true))
			});
			break;
		case 'all':
			allSlots = await db.query.taskSlots.findMany({
				with: {
					todoList: {
						with: {
							todos: true
						}
					},
					note: true
				},
				where: (taskSlots, { and, eq }) =>
					and(eq(taskSlots.user_id, userId), eq(taskSlots.archived, true))
			});
			break;
	}
	return allSlots;
};
