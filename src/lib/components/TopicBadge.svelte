<script>
	export let category;

	const badgeColorClass = {
		dorm: 'badge-warning badge',
		course: 'badge-info badge',
		club: 'badge-success badge'
	};
</script>

{#if category}
	<span class={badgeColorClass[category]}>{category}</span>
{/if}
