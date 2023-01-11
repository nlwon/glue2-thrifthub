<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Aside from '$lib/components/glue/Aside.svelte';
	import Main from '$lib/components/glue/Main.svelte';
	import PageContainer from '$lib/components/glue/PageContainer.svelte';
	import TextInput from '$lib/components/glue/TextInput.svelte';
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
	let processingTimeMs = 0;
	let estimatedTotalHits = 0;
	let query = $page.url.searchParams.get('query');

	const handleChangeQuery = (newQuery) => {
		query = newQuery;
		debouncedSearchByQuery(newQuery);
	};

	const searchByQuery = async (query) => {
		$page.url.searchParams.set('query', query);
		goto(`?${$page.url.searchParams.toString()}`, {
			keepFocus: true
		});
		const res = await client.index('topics').search(query);

		hits = res?.hits;
		processingTimeMs = res?.processingTimeMs || 0;
		estimatedTotalHits = res?.estimatedTotalHits || 0;

		if (query?.length > 0) {
			pb.collection('logs').create({
				variant: 'search',
				value: query
			});
		}
	};

	const debouncedSearchByQuery = debounce(searchByQuery, 200);

	onMount(() => {
		searchByQuery(query);
	});

	const SUGGESTED_SEARCH_QUERIES = [
		'cooking',
		'piano club',
		'toni morrison',
		'INFO 1300',
		'dance club',
		'web dev'
	];
</script>

<PageContainer title="Home" layout="aside-main">
	<Main>
		<div class="space-y-4">
			<TextInput
				bind:value={query}
				on:input={(event) => {
					handleChangeQuery(event?.target?.value);
				}}
				placeholder="🔍  Search for a topic"
				class="rounded-full pl-4"
			/>
			{#if Boolean(query)}
				<p class="ml-2 text-sm text-base-content/80">
					{hits?.length} of 7890 found in {processingTimeMs} milliseconds
				</p>
				<div class="space-y-2">
					{#each hits as hit (hit.id)}
						<TopicListItem topic={hit} />
					{/each}
				</div>
			{:else}
				<div>
					<p class="mt-8 mb-4 font-semibold uppercase">Suggested search terms</p>
					<div class="space-y-3">
						{#each SUGGESTED_SEARCH_QUERIES as queryString, idx (queryString)}
							<div>
								<button class="btn" on:click={() => handleChangeQuery(queryString)}
									>{idx + 1}. {queryString}</button
								>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</Main>
	<Aside>
		<div class="space-y-6 py-6 md:py-0">
			<div class="space-y-2">
				<p class="font-semibold uppercase">📚 Hot courses</p>
				<div class="space-y-2">
					<button class="btn-sm btn block">1. CS 1110</button>
					<button class="btn-sm btn block">1. CS 1110</button>
					<button class="btn-sm btn block">1. CS 1110</button>
				</div>
			</div>
			<div class="space-y-2">
				<p class="font-semibold uppercase">🏠 Hot dorms</p>
				<div class="space-y-2">
					<button class="btn-sm btn block">1. Ganędagǫ: Hall</button>
					<button class="btn-sm btn block">2. Toni Morrison Hall</button>
					<button class="btn-sm btn block">1. CS 1110</button>
				</div>
			</div>
			<div class="space-y-2">
				<p class="font-semibold uppercase">⚽ Hot clubs</p>
				<div class="space-y-2">
					<button class="btn-sm btn block">1. CS 1110</button>
					<button class="btn-sm btn block">1. CS 1110</button>
					<button class="btn-sm btn block">1. CS 1110</button>
				</div>
			</div>
		</div>
	</Aside>
</PageContainer>

<style>
	#icon-search {
		font-size: 1.6rem;
	}
</style>
