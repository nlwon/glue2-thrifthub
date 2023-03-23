<script lang="ts">
	import Aside from '$lib/components/glue/Aside.svelte';
	import Main from '$lib/components/glue/Main.svelte';
	import PageContainer from '$lib/components/glue/PageContainer.svelte';
	import { currentUser, pb } from '$lib/glue/pocketbase';
	import ListingItem from '$lib/components/ListingItem.svelte';
	import { onMount } from 'svelte';

	let listings = [];

	const fetchListings = async () => {
		try {
			listings = await pb.collection('listings').getFullList(200, {
				sort: '-updated',
				expand: 'user'
			});
		} catch (error) {}
	};

	onMount(() => {
		fetchListings();
	});
</script>

<PageContainer title="Home" layout="aside-main">
	<Aside>
		<div class="hidden space-y-3 rounded-lg bg-base-200 p-4  md:block">
			<p class="font-semibold text-base-content/90">Welcome to ThriftHub beta!</p>
			<div class="space-y-1 text-base-content/70">
				<p class="text-sm">
					Please share any feedback you may have using the button in the bottom left corner, or email us at:
				</p>
				<p class="text-sm">thrifthub.webdev@gmail.com</p>
			</div>
		</div>
		<!-- <h1>Filters</h1>
		<div>
			<input type="checkbox" id="clothing" name="clothing" value="Clothing" />
			<label for="clothing">Clothing</label><br />

			<input type="checkbox" id="decoration" name="decoration" value="Decoration" />
			<label for="decoration">Decoration</label><br />

			<input type="checkbox" id="furniture" name="furniture" value="Furniture" />
			<label for="furniture">Furniture</label><br />

			<input type="checkbox" id="electronics" name="electronics" value="Electronics" />
			<label for="electronics">Electronics</label><br />

			<input type="checkbox" id="supplies" name="supplies" value="Supplies" />
			<label for="supplies">Supplies</label>
		</div> -->
	</Aside>

	<Main>
		<div class="space-y-3">
			<h2 class="ml-1 text-2xl font-semibold tracking-wider">New Listings</h2>
			<div class="space-y-2">
				{#each listings as listing (listing?.id)}
					<ListingItem {listing} />
				{/each}
			</div>
		</div>
	</Main>
</PageContainer>
