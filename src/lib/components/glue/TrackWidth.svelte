<script>
	import { isMd, screenWidth } from '$lib/stores/glue/device';

	let innerWidth = 0;
	$: screenWidth.set(innerWidth);
	$: isMd.set(innerWidth >= 768);
</script>

<svelte:window bind:innerWidth />
