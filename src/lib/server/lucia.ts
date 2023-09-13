import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';
import { planetscale } from '@lucia-auth/adapter-mysql';
import { dev } from '$app/environment';
import { connection } from './db';

export const auth = lucia({
	adapter: planetscale(connection, {
		user: 'auth_user',
		key: 'user_key',
		session: 'user_session'
	}),
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),

	getUserAttributes: (data) => {
		return {
			username: data.username,
			role: data.role
		};
	}
});

export type Auth = typeof auth;
