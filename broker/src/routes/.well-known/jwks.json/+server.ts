import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	const publicJwk = {
		kty: 'RSA',
		n: 'xTn1PA7NXbDxUQjB6Auf6ezYWu8x9TqXUVcY9ikSTViExb2dWuOHRKZoL5zsFMlQTnf2PHe0dbsccsoS8kjOD7B2QhquDEQ4neebfC4o4vTBrAwDoigXm-uJn1trw-j0W31r_zwPjY6v6W1wXLh7ZACRPKvJVqmSXxR4VuFGdfjdgT2LQ10tc6PhOt-ayjdWPNHUQ8YgELf3mbum6lnEPZq5Nou1Kpe_xl3bF2VYdKJ-OkvzxKkXR8Pph9sQDUWXszE7lDMRDNihh6syH4LlSqq5cQSds0wKfAoNIX4v6_spxTBkgeAJ5Hy_OWnxJl1HI9xzQRrwNeRfNVrf0zUVKQ',
		e: 'AQAB',
		kid: 'simulated-key-id-1',
		alg: 'RS256',
		use: 'sig'
	};

	return json({
		keys: [publicJwk]
	});
};
