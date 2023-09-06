import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { todoLists, todos, taskSlots, notes } from '$lib/server/schema';
import type { NewSlotType, Todo } from '$lib/types';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { deleteSlot, userCanMutate } from '$lib/server/taskSlot.db';
import { noteSlotFormSchema } from '$lib/validate';

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

	updateSlot: async ({ request, locals }) => {
		const session = await locals.auth.validate();
		if (!session) throw redirect(302, '/login');

		const userId = session.user.userId;
		const data = await request.formData();
		const result = noteSlotFormSchema.safeParse(data);
		if (!result.success) {
			const data = {
				fieldErrors: result.error.flatten().fieldErrors
			};
			return fail(400, data);
		}
		const { slotId, noteId, text, title, archived } = result.data;
		const canMutate = userCanMutate(slotId, userId);
		if (!canMutate) {
			return { message: 'Can only delete own notes!' };
		}
		// const { archived };
		const resultSlot = await db
			.update(taskSlots)
			.set({ archived })
			.where(eq(taskSlots.note_id, noteId));
		const resultNote = await db.update(notes).set({ text, title }).where(eq(notes.id, noteId));
		const success = !!resultNote && !!resultSlot;
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

		const result = await deleteSlot(delteSlotId, deleteNoteId, deleteTodoListId, userId);
		const success = !!result;
		return { success };
	}
};
