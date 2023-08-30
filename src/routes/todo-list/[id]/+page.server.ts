import { db } from '$lib/server/db';
import { todoLists } from '$lib/server/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const todoList = await db.query.todoLists.findMany();
	console.log(todoList);
	return {
		todoList
	};
};
