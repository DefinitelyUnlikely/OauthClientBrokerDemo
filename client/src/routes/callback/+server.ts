import type { RequestHandler } from '@sveltejs/kit';
import { page } from '$app/state';
import { oauthVerifier } from '$lib/stores/oauthStore';

import { BROKER_URL } from '$env/static/private';

export const GET: RequestHandler = async ({ params }) => {
	const code = page.url.searchParams.get('code');
	const state = page.url.searchParams.get('state');

	if (!code || !oauthVerifier) {
		return new Response('Missing code or verifier', { status: 400 });
	}

	const response = await fetch(`${BROKER_URL}/auth/token`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({})
	});

	if (!response.ok) {
		const err = await response.text();
		return new Response(`Token exchange failed: ${err}`, { status: response.status });
	}

	const data = await response.json();
	const idToken = data.id_token;

	return new Response('Success');
};
