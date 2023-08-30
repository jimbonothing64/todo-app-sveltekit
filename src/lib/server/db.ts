import { connect } from '@planetscale/database';
import * as schema from './schema';
import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { DATABASE_URL } from '$env/static/private';

const connection = connect({ url: DATABASE_URL });

export const db = drizzle(connection, { schema });
