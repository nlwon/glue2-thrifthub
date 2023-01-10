<script>
	import TopicBadge from './TopicBadge.svelte';

	export let topic;
</script>

{#if topic}
	<a href={`/topic/${topic?.id}`}>
		<div class="space-y-2 border-b border-base-200 py-5">
			<h3 class="text-xl font-semibold">{topic?.name}</h3>
			<div class="flex items-center space-x-2">
				<TopicBadge category={topic?.category} />
				<p>{topic?.subtitle}</p>
			</div>
			<p class="text-sm text-base-content/80 line-clamp-3">{topic?.desc}</p>
		</div>
	</a>
{/if}
