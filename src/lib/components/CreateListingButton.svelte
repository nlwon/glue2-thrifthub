<script>
	import IconAdd from '$lib/icons/glue/IconAdd.svelte';
	import RequireAuthButton from './glue/RequireAuthButton.svelte';
</script>

<RequireAuthButton href="/create" class="btn-primary btn gap-2 pl-3">
	<span class="text-lg"><IconAdd /></span>New listing
</RequireAuthButton>
