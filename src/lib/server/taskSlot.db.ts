import { db } from './db';
import { eq } from 'drizzle-orm';
import { todos, todoLists, notes, taskSlots, user } from './schema';

export const userCanMutate = async (slotId, reqUserId) => {
	const theSlot = await db.query.taskSlots.findFirst({
		where: (taskSlots, { eq, and }) =>
			and(eq(taskSlots.id, slotId), eq(taskSlots.user_id, reqUserId))
	});
	return !!theSlot;
};

export const deleteSlot = async (slotId, noteId, todoId, reqUserId) => {
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
