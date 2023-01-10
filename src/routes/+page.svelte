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

	const client = new MeiliSearch({
		host: 'https://meilisearch-production-023b.up.railway.app/',
		apiKey: 'BpNG6BkFrQBQ3aOB3ao6yRMwGHnJzbFUt9k6MDZzNJ'
	});

	let hits = [];
	let processingTimeMs = 0;
	let estimatedTotalHits = 0;
	let query = $page.url.searchParams.get('query');

	const handleChange = (event) => {
		query = event?.target?.value;
		debouncedSearchByQuery(query);
	};

	const searchByQuery = async (query) => {
		$page.url.searchParams.set('query', query);
		goto(`?${$page.url.searchParams.toString()}`);
		const res = await client.index('topics').search(query);

		hits = res?.hits;
		processingTimeMs = res?.processingTimeMs || 0;
		estimatedTotalHits = res?.estimatedTotalHits || 0;
	};

	const debouncedSearchByQuery = debounce(searchByQuery, 200);

	onMount(() => {
		searchByQuery(query);
	});
</script>

<PageContainer title="Home" layout="aside-main">
	<Aside>aside</Aside>
	<Main>
		<div class="space-y-2">
			<TextInput bind:value={query} on:input={handleChange} />
			<p class="text-sm text-base-content/80">
				{hits?.length} of 7890 found in {processingTimeMs} milliseconds
			</p>
			<div class="space-y-2">
				{#each hits as hit (hit.id)}
					<TopicListItem topic={hit} />
				{/each}
			</div>
		</div>
	</Main>
</PageContainer>
