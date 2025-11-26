import { oauthVerifier } from '../../lib/stores/oauthStore';
import { generateVerifier, generateChallenge, generateState } from '../../lib/oauth';

import { CLIENT_ID, REDIRECT_URI } from '$env/static/private';

// Clear verifier just in case
oauthVerifier.set(null);

// Generate verifier and challenge
const verifier = await generateVerifier();
const challenge = await generateChallenge(verifier);
const state = await generateState();

// Set verifier
oauthVerifier.set(verifier);
const scope = 'openid profile';

const params = new URLSearchParams({
	client_id: CLIENT_ID,
	redirect_uri: REDIRECT_URI,
	response_type: 'code',
	scope,
	code_challenge: challenge,
	code_challenge_method: 'S256',
	state: 'some_random_state' // Should be random
});
