import { redirect, type RequestHandler } from '@sveltejs/kit';
import { page } from '$app/state';
import { get } from 'svelte/store';
import { oauthVerifier, oauthIdToken, oauthState } from '$lib/stores/oauthStore';

import { BROKER_URL } from '$env/static/private';

export const GET: RequestHandler = async ({ params }) => {
	const code = page.url.searchParams.get('code');
	const state = page.url.searchParams.get('state');
	const verifierValue = get(oauthVerifier);

	if (!code || !verifierValue) {
		return new Response('Missing code or verifier', { status: 400 });
	}

	const response = await fetch(`${BROKER_URL}/auth/token`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded' // Per protocol standard
		},
		body: new URLSearchParams({
			grant_type: 'authorization_code',
			code,
			redirect_uri: 'http://localhost:5174/callback',
			client_id: 'app1',
			code_verifier: verifierValue
		})
	});

	if (!response.ok) {
		const err = await response.text();
		return new Response(`Token exchange failed: ${err}`, { status: response.status });
	}

	const data = await response.json();
	oauthIdToken.set(data.id_token);

	// clear verifier and state
	oauthVerifier.set(null);
	oauthState.set(null);

	throw redirect(302, '/');
};
