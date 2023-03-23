<script>
	import { page } from '$app/stores';
	import Aside from '$lib/components/glue/Aside.svelte';
	import Main from '$lib/components/glue/Main.svelte';
	import PageContainer from '$lib/components/glue/PageContainer.svelte';
	import ListingForm from '$lib/components/ListingForm.svelte';
	import { pb } from '$lib/glue/pocketbase';
	import { onMount } from 'svelte';

	let listing;
	let isLoading = false;

	const fetchListing = async () => {
		isLoading = true;

		try {
			listing = await pb.collection('listings').getOne($page?.data?.listingId);
		} catch (error) {}

		isLoading = false;
	};

	onMount(() => {
		fetchListing();
	});
</script>

<div class="py-4">
	<PageContainer title="Edit listing" layout="aside-main">
		<Main>
			<div class="space-y-4">
				<h2 class="text-4xl font-semibold">Edit Listing</h2>
				{#if listing}
					<ListingForm initialValues={listing} />
				{:else if isLoading}
					<p class="text-sm">Loading...</p>
				{:else}
					<p class="text-sm">Failed to load listing. Please try refreshing the page.</p>
				{/if}
			</div>
		</Main>
		<Aside />
	</PageContainer>
</div>
