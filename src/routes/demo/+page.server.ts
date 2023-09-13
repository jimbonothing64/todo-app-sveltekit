import { DEMO_KEY, DEMO_VALUE, DEMO_ACCOUNT_PASSWORD } from '$env/static/private';
import { auth } from '$lib/server/lucia';
import { generateRandomString } from 'lucia/utils';
import { fail, redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';
import { LuciaError } from 'lucia';
export const load: PageServerLoad = async ({ locals, url }) => {
	const session = await locals.auth.validate();
	if (session) throw redirect(302, '/app');

	const urlKey = url.searchParams.get(DEMO_KEY);
	if (urlKey !== DEMO_VALUE) throw redirect(302, '/');

	const username = 'DemoUser' + generateRandomString(4);
	const password = DEMO_ACCOUNT_PASSWORD;

	try {
		const user = await auth.createUser({
			key: {
				providerId: 'username', // auth method
				providerUserId: username.toLowerCase(), // unique id when using "username" auth method
				password // hashed by Lucia
			},
			attributes: {
				username,
				role: 'demo'
			}
		});

		const session = await auth.createSession({
			userId: user.userId,
			attributes: {}
		});
		locals.auth.setSession(session); // set session cookie
	} catch (e) {
		// check for unique constraint error in user table
		console.log(e);
		if (e instanceof LuciaError && e.message === 'AUTH_DUPLICATE_KEY_ID') {
			return fail(400, {
				formErrors: ['Username already taken']
			});
		}
		return fail(500, {
			formErrors: ['An unknown error occurred']
		});
	}

	throw redirect(302, '/app');
};
