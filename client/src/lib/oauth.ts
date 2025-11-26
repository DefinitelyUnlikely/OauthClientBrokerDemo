export async function generateVerifier(): Promise<string> {
	const array = new Uint8Array(32);
	crypto.getRandomValues(array);
	return base64UrlEncode(array);
}

export async function generateChallenge(verifier: string): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(verifier);
	const hash = await crypto.subtle.digest('SHA-256', data);
	return base64UrlEncode(new Uint8Array(hash));
}

export async function generateState(): Promise<string> {
	const array = new Uint8Array(8);
	crypto.getRandomValues(array);
	return base64UrlEncode(array);
}

function base64UrlEncode(array: Uint8Array): string {
	let str = '';
	for (let i = 0; i < array.length; i++) {
		str += String.fromCharCode(array[i]);
	}
	return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
