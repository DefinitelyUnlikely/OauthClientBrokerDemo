import type { RequestHandler } from '@sveltejs/kit';
import { error, redirect } from '@sveltejs/kit';
import { nanoid } from 'nanoid';
import { db } from '$lib/dataAccess/database';
import { auth } from '$lib/auth';

export const GET: RequestHandler = async ({ url, request }) => {
	const client_id = url.searchParams.get('client_id');
	const redirect_uri = url.searchParams.get('redirect_uri');
	const response_type = url.searchParams.get('response_type');
	const state = url.searchParams.get('state');
	const code_challenge = url.searchParams.get('code_challenge');
	const code_challenge_method = url.searchParams.get('code_challenge_method');

	if (
		!client_id ||
		!redirect_uri ||
		!response_type ||
		!state ||
		!code_challenge ||
		!code_challenge_method
	) {
		throw error(400, 'Invalid request');
	}

	if (response_type !== 'code') {
		throw error(400, 'Invalid response type');
	}

	if (code_challenge_method !== 'S256') {
		throw error(400, 'Invalid code challenge method');
	}

	const client = await db
		.selectFrom('oauth_clients')
		.selectAll()
		.where('id', '=', client_id)
		.executeTakeFirst();

	if (!client) {
		throw error(400, 'Invalid client');
	}

	if (client.redirect_uri !== redirect_uri) {
		throw error(400, 'Invalid redirect_uri');
	}

	// Also need to check if there is a valid user session in the broker.
	// If not, redirect to the login page.
	const session = await auth.api.getSession({
		headers: request.headers
	});

	if (!session) {
		// If no session, redirect to the login page and add the current URL (With query parameters) to redirect
		// back to this page after login.
		throw redirect(302, '/login?redirectTo=' + encodeURIComponent(url.toString()));
	}

	const user_id = session.user.id;
	const code = nanoid();
	const expires_at = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

	await db
		.insertInto('oauth_codes')
		.values({
			code,
			client_id,
			redirect_uri,
			user_id,
			expires_at,
			code_challenge,
			code_challenge_method
		})
		.execute();

	const redirectURL = new URL(redirect_uri);
	redirectURL.searchParams.set('code', code);
	redirectURL.searchParams.set('state', state);
	throw redirect(302, redirectURL.toString());
};
