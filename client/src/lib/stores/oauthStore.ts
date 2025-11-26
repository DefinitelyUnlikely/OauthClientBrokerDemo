import { writable } from 'svelte/store';

// in reality, we add a TTL.
export const oauthVerifier = writable<string | null>(null);
export const oauthState = writable<string | null>(null);

// store tokens as well
export const oauthIdToken = writable<string | null>(null);
