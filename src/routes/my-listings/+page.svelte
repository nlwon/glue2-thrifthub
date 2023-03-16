<script lang="ts">
	import Aside from '$lib/components/glue/Aside.svelte';
	import Main from '$lib/components/glue/Main.svelte';
	import PageContainer from '$lib/components/glue/PageContainer.svelte';
	import ListingItem from '$lib/components/ListingItem.svelte';
	import ProfileNavs from '$lib/components/ProfileNavs.svelte';
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

<PageContainer title="My listings" layout="aside-main">
	<Aside>
		<ProfileNavs />
	</Aside>
	<Main>
		<div class="space-y-4">
			<h2 class="text-2xl font-semibold tracking-wider">My listings</h2>
			<div class="space-y-2">
				{#each listings as listing (listing?.id)}
					<ListingItem {listing} />
				{/each}
			</div>
		</div>
	</Main>
</PageContainer>
