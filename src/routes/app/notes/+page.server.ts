import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { taskSlots, notes } from '$lib/server/schema';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { getAllArchivedSlots, getAllCurrentSlots, userCanMutate } from '$lib/server/taskSlot.db';
import { newNoteSlotFormSchema, noteSlotFormSchema } from '$lib/validate/note';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, '/login');
	const userId = session.user.userId;

	const fetchAllCurrentNotes = async () => {
		const allNotes = await getAllCurrentSlots(userId, 'notes');
		return allNotes;
	};

	const fetchAllArchivedNotes = async () => {
		const allNotes = await getAllArchivedSlots(userId, 'notes');
		return allNotes;
	};

	return {
		allCurrent: fetchAllCurrentNotes(),
		allArchived: fetchAllArchivedNotes()
	};
};

export const actions: Actions = {
	createSlot: async ({ request, locals }) => {
		const session = await locals.auth.validate();
		if (!session) throw redirect(302, '/login');
		const userId = session.user.userId;

		const data = await request.formData();
		const slotResult = newNoteSlotFormSchema.safeParse(data);
		if (!slotResult.success) {
			const errors = {
				fieldErrors: slotResult.error.flatten().fieldErrors
			};
			return fail(400, errors);
		}

		const note = slotResult.data;
		const noteId = parseInt((await db.insert(notes).values(note)).insertId);
		await db.insert(taskSlots).values({ note_id: noteId, user_id: userId });

		return { success: true };
	},
	updateSlot: async ({ request, locals }) => {
		const session = await locals.auth.validate();
		if (!session) throw redirect(302, '/login');

		const userId = session.user.userId;
		const data = await request.formData();
		const result = noteSlotFormSchema.safeParse(data);
		if (!result.success) {
			const errors = {
				fieldErrors: result.error.flatten().fieldErrors
			};
			return fail(400, errors);
		}
		const { slotId, noteId, text, title, archived } = result.data;
		const canMutate = userCanMutate(slotId, userId);
		if (!canMutate) {
			return { message: 'Can only edit own notes!' };
		}
		const resultSlot = await db
			.update(taskSlots)
			.set({ archived })
			.where(eq(taskSlots.note_id, noteId));
		const resultNote = await db.update(notes).set({ text, title }).where(eq(notes.id, noteId));
		const success = !!resultNote && !!resultSlot;
		return { success };
	}
};
