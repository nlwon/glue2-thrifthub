<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Aside from '$lib/components/glue/Aside.svelte';
	import Main from '$lib/components/glue/Main.svelte';
	import PageContainer from '$lib/components/glue/PageContainer.svelte';
	import TextInput from '$lib/components/glue/TextInput.svelte';
	import HotTopics from '$lib/components/HotTopics.svelte';
	import TopicListItem from '$lib/components/TopicListItem.svelte';
	import { pb } from '$lib/glue/pocketbase';
	import debounce from 'just-debounce-it';
	import { MeiliSearch } from 'meilisearch';
	import { onMount } from 'svelte';

	const client = new MeiliSearch({
		host: 'https://meilisearch-production-023b.up.railway.app/',
		apiKey: 'BpNG6BkFrQBQ3aOB3ao6yRMwGHnJzbFUt9k6MDZzNJ'
	});

	let hits = [];
	let popularCourses = [];
	let processingTimeMs = 0;
	let estimatedTotalHits = 0;
	let query = $page.url.searchParams.get('query');

	const handleChangeQuery = (newQuery) => {
		query = newQuery;
		debouncedSearchByQuery(newQuery);
	};

	const searchByQuery = async (query) => {
		if (query?.length > 0) {
			$page.url.searchParams.set('query', query);
			goto(`?${$page.url.searchParams.toString()}`, {
				keepFocus: true
			});
		} else {
			$page.url.searchParams.delete('query');
			goto(`?${$page.url.searchParams.toString()}`, {
				keepFocus: true
			});
		}

		// reset hits before searching to prevent
		// previous hits from flashing
		hits = [];

		const res = await client.index('topics').search(query);

		hits = res?.hits;
		processingTimeMs = res?.processingTimeMs || 0;
		estimatedTotalHits = res?.estimatedTotalHits || 0;

		if (import.meta.env.MODE === 'production' && query?.length > 0) {
			pb.collection('logs').create({
				variant: 'search',
				value: query
			});
		}
	};

	const debouncedSearchByQuery = debounce(searchByQuery, 500);

	onMount(async () => {
		searchByQuery(query);
		const coursesData = await pb.collection('topics').getList(1, 4, {
			filter: "category='course'",
			sort: '-pageView'
		});
		popularCourses = coursesData?.items || [];
	});

	const SUGGESTED_SEARCH_QUERIES = ['dance clubs', 'sophomore dorms', 'info 1300'];
</script>

<PageContainer title="Home" layout="aside-main">
	<Main>
		<div class="space-y-4">
			<div class="rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-0.5">
				<TextInput
					bind:value={query}
					on:input={(event) => {
						handleChangeQuery(event?.target?.value);
					}}
					placeholder="🔍  Search for a topic"
					class="w-full rounded-full pl-4"
				/>
			</div>
			<div>
				<div class="flex items-center space-x-2 overflow-auto pb-3">
					{#each SUGGESTED_SEARCH_QUERIES as queryString, idx (queryString)}
						<button class="btn-outline btn-sm btn" on:click={() => handleChangeQuery(queryString)}
							>{queryString}</button
						>
					{/each}
				</div>
				{#if Boolean(query)}
					<p class="mt-4 text-sm text-base-content/80">
						{hits?.length} of 7890 found in {processingTimeMs} milliseconds
					</p>
					<div class="space-y-2">
						{#each hits as hit (hit.id)}
							<TopicListItem topic={hit} />
						{/each}
					</div>
				{:else}
					<div class="space-y-2">
						{#each popularCourses as course (course.id)}
							<TopicListItem topic={course} />
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</Main>
	<Aside>
		<HotTopics />
	</Aside>
</PageContainer>

<style>
	#icon-search {
		font-size: 1.6rem;
	}
</style>
