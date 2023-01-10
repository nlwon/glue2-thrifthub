<script lang="ts">
	import IconBack from '$lib/icons/glue/IconBack.svelte';
</script>

<button class={`${$$props.class} btn gap-2`} on:click={() => history.back()}
	><IconBack />Back</button
>
