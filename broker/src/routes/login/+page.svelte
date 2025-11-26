<script lang="ts">
	import { authClient } from '$lib/authClient';
    import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

    let redirect_uri = page.url.searchParams.get('redirect_uri') || '/error';

    onMount(() => {
        if (!redirect_uri) {
            goto('/error');
        }
    });
</script>

<h1>Sign in</h1>
<h2>Sign in with GitHub</h2>
<button on:click={() => authClient.signIn.social({ provider: 'github', callbackURL: redirect_uri })}>Login with GitHub</button>