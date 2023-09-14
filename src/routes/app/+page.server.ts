import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { deleteSlot, getAllArchivedSlots, getAllCurrentSlots } from '$lib/server/taskSlot.db';
import { delteSlotSchema } from '$lib/validate/slot';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, '/login');
	const userId = session.user.userId;

	const fetchAllCurrentSlots = async () => {
		const allTodos = await getAllCurrentSlots(userId, 'all');
		return allTodos;
	};

	const fetchAllArchivedSlots = async () => {
		const allTodos = await getAllArchivedSlots(userId, 'all');
		return allTodos;
	};

	return {
		allCurrent: fetchAllCurrentSlots(),
		allArchived: fetchAllArchivedSlots()
	};
};

export const actions: Actions = {
	deleteTaskSlot: async ({ request, locals }) => {
		const session = await locals.auth.validate();
		if (!session) throw redirect(302, '/login');
		const userId = session.user.userId;

		const data = await request.formData();
		const result = delteSlotSchema.safeParse(data);
		if (!result.success) {
			const errors = {
				fieldErrors: result.error.flatten().fieldErrors
			};
			return fail(400, errors);
		}

		const { id, noteId, todoListId } = result.data;
		const success = await deleteSlot(id, noteId, todoListId, userId);
		return { success };
	}
};
