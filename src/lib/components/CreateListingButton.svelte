<script>
	import IconAdd from '$lib/icons/glue/IconAdd.svelte';
	import { isMd } from '$lib/stores/glue/device';
	import RequireAuthButton from './glue/RequireAuthButton.svelte';

	$: label = $isMd ? 'New Listing' : 'Listing';
</script>

<RequireAuthButton href="/create" class="btn-primary btn-sm btn gap-1 pl-2 md:gap-2 md:btn-md">
	<span class="text-lg"><IconAdd /></span>{label}
</RequireAuthButton>
