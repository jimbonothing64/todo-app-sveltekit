import { auth } from '$lib/server/lucia';
import { LuciaError } from 'lucia';
import { fail, redirect } from '@sveltejs/kit';
import { loginFormSchema } from '$lib/validate/stories';

import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (session) throw redirect(302, '/app');
	return {};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const result = loginFormSchema.safeParse(formData);

		if (!result.success) {
			const data = {
				fieldErrors: result.error.flatten().fieldErrors
			};
			return fail(400, data);
		}

		const { username, password } = result.data;
		try {
			// find user by key
			// and validate password
			const key = await auth.useKey('username', username, password);
			const session = await auth.createSession({
				userId: key.userId,
				attributes: {}
			});
			locals.auth.setSession(session); // set session cookie
		} catch (e) {
			if (
				e instanceof LuciaError &&
				(e.message === 'AUTH_INVALID_KEY_ID' || e.message === 'AUTH_INVALID_PASSWORD')
			) {
				// user does not exist
				// or invalid password
				return fail(400, {
					formErrors: ['Incorrect username or password.']
				});
			}
			return fail(500, {
				formErrors: ['An unknown error occurred.']
			});
		}

		// redirect to
		// make sure you don't throw inside a try/catch block!
		throw redirect(302, '/app');
	}
};
