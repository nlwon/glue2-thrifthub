<script>
	import IconAdd from '$lib/icons/glue/IconAdd.svelte';
	import { isMd } from '$lib/stores/glue/device';
	import RequireAuthButton from './glue/RequireAuthButton.svelte';

	$: label = $isMd ? 'New listing' : 'Listing';
</script>

<RequireAuthButton href="/create" class="btn-primary btn gap-2 pl-3">
	<span class="text-lg"><IconAdd /></span>{label}
</RequireAuthButton>
