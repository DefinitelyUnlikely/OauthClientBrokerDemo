import { auth } from '$lib/auth';
import { redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, request }) => {
	const redirectTo = url.searchParams.get('redirect_uri');

	// let better-auth handle logout for the broker
	await auth.api.signOut({
		headers: request.headers
	});

	// Now, we need to contact all the service providers
	// to let them know that the user has logged out and they need to invalidate the session

	if (redirectTo) {
		redirect(302, redirectTo);
	}

	redirect(302, '/');
};
