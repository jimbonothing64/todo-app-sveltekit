import { auth } from '$lib/server/lucia';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// Get auth user.
	event.locals.auth = auth.handleRequest(event);
	const session = await event.locals.auth.validate();
	if (event.url.pathname.startsWith('/app') && !session) {
		throw redirect(303, '/login');
	}
	// if (event.route.id?.startsWith('/(auth)')) {
	// 	throw redirect(303, '/login');
	// }

	return await resolve(event);
};
