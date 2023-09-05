import type { PageServerLoad } from '../../$types';
import { db } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';
import { taskSlots } from '$lib/server/schema';

export const load: PageServerLoad = async ({ params, locals }) => {
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, '/login');

	const { reqUserId } = session.user;

	const fetchNote = async () => {
		return await db.query.notes.findFirst({
			// with: { taskSlots: true },
			where: (notes, { eq, and }) => eq(notes.id, params.id)
		});
	};

	return {
		note: fetchNote()
	};
};

export const actions: Actions = {
	updateNote: async ({ locals, request }) => {},
	deleteNote: async ({ locals, request }) => {
		console.log('hi');
	}
};
