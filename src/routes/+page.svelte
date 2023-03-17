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
		<h1>Welcome!</h1>
		<h2>This is ThriftHub Beta! Please leave us any feedback below...</h2>
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
		<h1>Listings</h1>
		<div class="card bg-base-100 shadow-xl">
			<!-- <figure class="px-10 pt-10">
				<img
					src="/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
					alt="Listing"
					class="rounded-xl"
				/>
			</figure>
			<div class="card-body items-center text-center">
				<h2 class="card-title">Item Name</h2>
				<p>This is the description for the item</p>
				<div class="card-actions">
					<button class="btn-primary btn">Message Poster</button>
				</div> -->

			<div class="space-y-2">
				{#each listings as listing (listing?.id)}
					<ListingItem {listing} />
				{/each}
			</div>
		</div>
		<!-- </div> -->
	</Main>
</PageContainer>
