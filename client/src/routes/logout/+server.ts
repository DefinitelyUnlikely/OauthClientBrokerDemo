import { redirect, type RequestHandler } from '@sveltejs/kit';
import { BROKER_URL, BASE_URL } from '$env/static/private';

export const GET: RequestHandler = async ({ cookies }) => {
	cookies.delete('oauth_id_token', { path: '/' });
	throw redirect(302, `${BROKER_URL}/logout?redirect_uri=${BASE_URL}`);
};

// Use the post method to logout from the broker
export const POST: RequestHandler = async ({ cookies }) => {
	cookies.delete('oauth_id_token', { path: '/' });
	return new Response(null, { status: 200 });
};
