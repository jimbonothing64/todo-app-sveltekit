import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';
import { planetscale } from '@lucia-auth/adapter-mysql';
import { dev } from '$app/environment';
import { connection } from './db';
import { DATABASE_TABLE_PREFIX } from '$env/static/private';

export const auth = lucia({
	adapter: planetscale(connection, {
		user: DATABASE_TABLE_PREFIX + '_' + 'auth_user',
		key: DATABASE_TABLE_PREFIX + '_' + 'user_key',
		session: DATABASE_TABLE_PREFIX + '_' + 'user_session'
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
