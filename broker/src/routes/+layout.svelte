<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { title } from 'process';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Broker</title>
</svelte:head>

{@render children()}
