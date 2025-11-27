import { redirect, type RequestHandler } from '@sveltejs/kit';
import { BROKER_URL, BASE_URL } from '$env/static/private';

export const GET: RequestHandler = async ({ params }) => {
	throw redirect(302, `${BROKER_URL}/logout?redirect_uri=${BASE_URL}`);
};
