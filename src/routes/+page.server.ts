import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		allTodoLists: await db.query.todoLists.findMany()
	};
};
