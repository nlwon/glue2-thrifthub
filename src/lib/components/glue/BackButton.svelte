<script lang="ts">
	import { goto } from '$app/navigation';
	import IconBack from '$lib/icons/glue/IconBack.svelte';

	export let fallbackLabel = 'Go home';
	export let fallbackPath = '/';
	export let isRenderLabel = true;

	const handleClick = () => {
		if (canBack) history?.back();
		else {
			goto(fallbackPath);
		}
	};

	let canBack = false;
	$: canBack = history?.length > 1;
</script>

<button class={`${$$props.class} btn gap-2`} on:click={handleClick}
	><IconBack />
	{#if isRenderLabel}
		{canBack ? 'Back' : fallbackLabel}
	{/if}
</button>
