import type { RequestHandler } from './$types';
import { db } from '$lib/dataAccess/database';
import { auth } from '$lib/auth';
import { error } from '@sveltejs/kit';

async function verifyChallenge(verifier: string, challenge: string, method: string) {
	if (method !== 'S256') return false;

	const encoder = new TextEncoder();
	const data = encoder.encode(verifier);
	const hash = await crypto.subtle.digest('SHA-256', data);

	// Convert to base64url
	const hashArray = Array.from(new Uint8Array(hash));
	const base64 = btoa(String.fromCharCode(...hashArray))
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '');

	return base64 === challenge;
}

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.formData();
	const grant_type = body.get('grant_type');
	const code = body.get('code')?.toString();
	const redirect_uri = body.get('redirect_uri')?.toString();
	const client_id = body.get('client_id')?.toString();
	const code_verifier = body.get('code_verifier')?.toString();

	if (grant_type !== 'authorization_code') {
		throw error(400, 'Invalid grant type');
	}

	if (!code || !redirect_uri || !client_id || !code_verifier) {
		throw error(400, 'Missing parameters');
	}

	const authCode = await db
		.selectFrom('oauth_codes')
		.selectAll()
		.where('code', '=', code)
		.executeTakeFirst();

	if (!authCode) {
		throw error(400, 'Invalid code');
	}

	if (authCode.expires_at < new Date()) {
		throw error(400, 'Code expired');
	}

	if (authCode.client_id !== client_id) {
		throw new Error('Invalid client id');
	}

	if (authCode.redirect_uri !== redirect_uri) {
		throw new Error('Invalid redirect uri');
	}

	const isValidChallenge = await verifyChallenge(
		code_verifier,
		authCode.code_challenge,
		authCode.code_challenge_method
	);
	if (!isValidChallenge) {
		throw error(400, 'Invalid code verifier');
	}

	return new Response(JSON.stringify(body));
};
