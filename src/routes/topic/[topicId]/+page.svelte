<script>
	import { page } from '$app/stores';
	import Aside from '$lib/components/glue/Aside.svelte';
	import BackButton from '$lib/components/glue/BackButton.svelte';
	import ComingSoonButton from '$lib/components/glue/ComingSoonButton.svelte';
	import Main from '$lib/components/glue/Main.svelte';
	import PageContainer from '$lib/components/glue/PageContainer.svelte';
	import HotTopics from '$lib/components/HotTopics.svelte';
	import TopicBadge from '$lib/components/TopicBadge.svelte';
	import TopicQa from '$lib/components/TopicQA.svelte';
	import { pb } from '$lib/glue/pocketbase';
	import IconFacebook from '$lib/icons/glue/IconFacebook.svelte';
	import IconInstagram from '$lib/icons/glue/IconInstagram.svelte';
	import IconNewTab from '$lib/icons/glue/IconNewTab.svelte';
	import IconPage from '$lib/icons/glue/IconPage.svelte';
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

	const categoryToLinks = {
		club: [
			{
				label: 'Instagram',
				icon: IconInstagram
			},
			{
				label: 'Facebook',
				icon: IconFacebook
			},
			{
				label: 'Website',
				icon: IconPage
			}
		],
		course: [
			{
				label: 'roster',
				icon: IconPage
			}
		]
	};
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
					{#if ['course', 'club']?.includes(topic?.category)}
						<div>
							<h2 class="mb-4 text-3xl font-semibold">Links</h2>
							<div class="space-y-3">
								{#each categoryToLinks[topic?.category] as linkItem (linkItem?.label)}
									<div>
										<ComingSoonButton
											class="btn-outline"
											variant={`click-topic-link-${linkItem?.label}`}
											context={topic}
											><svelte:component this={linkItem?.icon} />{linkItem?.label} <IconNewTab />
										</ComingSoonButton>
									</div>
								{/each}
							</div>
						</div>
					{/if}
					<TopicQa {topic} />
				</div>
			</div>
		</Main>
		<Aside>
			<HotTopics />
		</Aside>
	</PageContainer>
{/if}
