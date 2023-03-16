<script lang="ts">
	import PageContainer from '$lib/components/glue/PageContainer.svelte';
	import ListingItem from '$lib/components/ListingItem.svelte';
	import { currentUser, pb } from '$lib/glue/pocketbase';
	import { onMount } from 'svelte';

	let listings = [];

	const fetchListings = async () => {
		try {
			listings = await pb.collection('listings').getFullList(200, {
				filter: `user="${$currentUser?.id}"`,
				expand: 'user'
			});
		} catch (error) {}
	};

	onMount(() => {
		fetchListings();
	});
</script>

<PageContainer title="My listings">
	<div class="space-y-2">
		{#each listings as listing (listing?.id)}
			<ListingItem {listing} />
		{/each}
	</div>
</PageContainer>
