<script lang="ts">
	import { redirect } from "@sveltejs/kit";

    const signIn = async () => {
        window.location.href = "http://localhost:5173/login?redirect_uri=http://localhost:5174/callback"
    };
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<button on:click={signIn}>Login</button>
