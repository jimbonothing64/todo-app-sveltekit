import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { todoLists, todos, taskSlots, notes } from '$lib/server/schema';
import type { NewSlotType, Todo } from '$lib/types';
import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { deleteSlot, userCanMutate } from '$lib/server/taskSlot.db';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, '/login');
	const userId = session.user.userId;

	const fetchAllNotes = async () => {
		const allNotes = await db.query.taskSlots.findMany({
			with: {
				note: true
			},
			where: (taskSlots, { eq }) => eq(taskSlots.user_id, userId)
		});
		return allNotes;
	};
	return {
		// userId: session.user.userId,
		// username: session.user.username,
		allTaskSlots: fetchAllNotes()
	};
};

export const actions: Actions = {
	// createSlot: async ({ request, locals }) => {
	// 	const session = await locals.auth.validate();
	// 	if (!session) throw redirect(302, '/login');
	// 	const userId = session.user.userId;

	// 	const data = await request.formData();
	// 	const title = data.get('title');
	// 	const type: NewSlotType = data.get('type') || 'note';
	// 	const toInsert = {
	// 		title
	// 	};
	// 	if (!title) return { success: false };

	//  if (type === 'note') {
	// 		const text = data.get('text');
	// 		const newNotes = await db.insert(notes).values({ title, text });
	// 		await db.insert(taskSlots).values({ note_id: newNotes.insertId, user_id: userId });
	// 	}

	// 	return { success: true };
	// },

	// createTodoList: async ({ request }) => {
	// 	const data = await request.formData();
	// 	const title = data.get('title');
	// 	const toInsert = {
	// 		title
	// 	};
	// 	if (!title) return { success: false };

	// 	const todoListss = await db.insert(todoLists).values(toInsert);
	// 	await db.insert(taskSlots).values({ todo_list_id: todoListss.insertId });
	// 	return { success: true };
	// },

	// createNote: async ({ request }) => {
	// 	const data = await request.formData();
	// 	const title = data.get('title');
	// 	const text = data.get('text');
	// 	if (!title) return { success: false };

	// 	const todoListss = await db.insert(notes).values({ title, text });
	// 	await db.insert(taskSlots).values({ note_id: todoListss.insertId });
	// 	return { success: true };
	// },

	updateNote: async ({ request, locals }) => {
		const session = await locals.auth.validate();
		if (!session) throw redirect(302, '/login');

		const userId = session.user.userId;
		const data = await request.formData();
		const { slotId, noteId, ...rest } = Object.fromEntries(data);
		const canMutate = userCanMutate(slotId, userId);
		if (!canMutate) {
			return { message: 'Can only delete own notes!' };
		}
		const result = await db.update(notes).set(rest).where(eq(notes.id, noteId));
		const success = !!result;
		return { success };
	},

	deleteTaskSlot: async ({ request, locals }) => {
		const session = await locals.auth.validate();
		if (!session) throw redirect(302, '/login');
		const userId = session.user.userId;

		const data = await request.formData();
		const delteSlotId = data.get('id');
		const deleteNoteId = data.get('noteId');
		const deleteTodoListId = data.get('todoListId');

		const result = await deleteSlot(delteSlotId, deleteNoteId, deleteTodoListId, userId);
		const success = !!result;
		return { success };
	}
};
