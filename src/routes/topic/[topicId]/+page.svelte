<script>
	import { page } from '$app/stores';
	import Aside from '$lib/components/glue/Aside.svelte';
	import BackButton from '$lib/components/glue/BackButton.svelte';
	import Main from '$lib/components/glue/Main.svelte';
	import PageContainer from '$lib/components/glue/PageContainer.svelte';
	import HotTopics from '$lib/components/HotTopics.svelte';
	import TopicBadge from '$lib/components/TopicBadge.svelte';
	import TopicQa from '$lib/components/TopicQA.svelte';
	import { pb } from '$lib/glue/pocketbase';
	import { onMount } from 'svelte';

	const topicId = $page?.url?.pathname?.split('/')[2];
	let topic = null;
	let isDescLineClamp = true;

	onMount(async () => {
		topic = await pb.collection('topics').getOne(topicId);
		if (topic?.id)
			pb.collection('topics').update(topic?.id, {
				pageView: topic?.pageView + 1
			});
	});
</script>

{#if topic}
	<PageContainer title={`${topic?.name} - ${topic?.subtitle}`} layout="aside-main">
		<Main>
			<div class="space-y-8">
				<BackButton class="btn-sm" />
				<div class="space-y-14">
					<div class="prose">
						<h1>{topic?.name}</h1>
						<div class="flex items-center space-x-3">
							<TopicBadge category={topic?.category} />
							{#if topic?.subtitle}
								<h4 class="m-0">{topic?.subtitle}</h4>
							{/if}
						</div>
						<p class={`whitespace-pre-line ${isDescLineClamp ? 'line-clamp-5' : ''}`}>
							{topic?.desc}
						</p>
						{#if topic?.desc?.length > 340}
							<button class="btn-sm btn" on:click={() => (isDescLineClamp = !isDescLineClamp)}
								>Show {isDescLineClamp ? 'all' : 'less'}</button
							>
						{/if}
					</div>
					<TopicQa {topic} />
				</div>
			</div>
		</Main>
		<Aside>
			<HotTopics />
		</Aside>
	</PageContainer>
{/if}
