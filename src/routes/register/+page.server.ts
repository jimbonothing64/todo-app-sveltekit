import { auth } from '$lib/server/lucia';
import { fail, redirect } from '@sveltejs/kit';
import { registerFormSchema } from '$lib/validate/stories';

import type { PageServerLoad, Actions } from './$types';
import { LuciaError } from 'lucia';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (session) throw redirect(302, '/app');
	return {};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const result = registerFormSchema.safeParse(formData);

		if (!result.success) {
			const data = {
				fieldErrors: result.error.flatten().fieldErrors
			};
			return fail(400, data);
		}
		const { username, password } = result.data;
		try {
			const user = await auth.createUser({
				key: {
					providerId: 'username', // auth method
					providerUserId: username.toLowerCase(), // unique id when using "username" auth method
					password // hashed by Lucia
				},
				attributes: {
					username
				}
			});
		} catch (e) {
			// check for unique constraint error in user table
			if (e instanceof LuciaError && e.message === 'AUTH_DUPLICATE_KEY_ID') {
				return fail(400, {
					formErrors: ['Username already taken']
				});
			}
			return fail(500, {
				formErrors: ['An unknown error occurred']
			});
		}
		// redirect to
		// make sure you don't throw inside a try/catch block!
		throw redirect(302, '/login');
	}
};
