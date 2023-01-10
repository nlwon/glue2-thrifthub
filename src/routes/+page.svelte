<script lang="ts">
	import Aside from '$lib/components/glue/Aside.svelte';
	import Main from '$lib/components/glue/Main.svelte';
	import PageContainer from '$lib/components/glue/PageContainer.svelte';
	import TextInput from '$lib/components/glue/TextInput.svelte';
	import TopicListItem from '$lib/components/TopicListItem.svelte';
	import debounce from 'just-debounce-it';
	import { MeiliSearch } from 'meilisearch';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import ka from 'date-fns/locale/ka';

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
	};

	const debouncedSearchByQuery = debounce(searchByQuery, 200);

	onMount(() => {
		searchByQuery(query);
	});

	const SUGGESTED_SEARCH_QUERIES = [
		'cooking',
		'piano club',
		'toni morrison',
		'CS 1110',
		'dance club',
		'web dev'
	];
</script>

<PageContainer title="Home" layout="aside-main">
	<Main>
		<div class="space-y-6">
			<TextInput
				bind:value={query}
				on:input={(event) => {
					handleChangeQuery(event?.target?.value);
				}}
			/>
			{#if Boolean(query)}
				<p class="text-sm text-base-content/80">
					{hits?.length} of 7890 found in {processingTimeMs} milliseconds
				</p>
				<div class="space-y-2">
					{#each hits as hit (hit.id)}
						<TopicListItem topic={hit} />
					{/each}
				</div>
			{:else}
				<div class="space-y-4">
					<p class="font-semibold uppercase">Suggested searches</p>
					<div class="space-y-2">
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
	<Aside>aside</Aside>
</PageContainer>
