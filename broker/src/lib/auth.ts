import { betterAuth } from 'better-auth';
import { MssqlDialect } from 'kysely';
import * as Tedious from 'tedious';
import * as Tarn from 'tarn';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';

import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '$env/static/private';

const dialect = new MssqlDialect({
	tarn: {
		...Tarn,
		options: {
			min: 0,
			max: 10
		}
	},
	tedious: {
		...Tedious,
		connectionFactory: () =>
			new Tedious.Connection({
				authentication: {
					options: {
						password: 'password123!',
						userName: 'sa'
					},
					type: 'default'
				},
				options: {
					database: 'broker',
					port: 1433,
					trustServerCertificate: true
				},
				server: 'localhost'
			})
	}
});

export const auth = betterAuth({
	database: {
		dialect,
		type: 'mssql'
	},
	socialProviders: {
		github: {
			clientId: GITHUB_CLIENT_ID,
			clientSecret: GITHUB_CLIENT_SECRET
		}
	},
	plugins: [sveltekitCookies(getRequestEvent)] // make sure sveltekitCookies is last in the array
});
