<script lang="ts">
	import Aside from '$lib/components/glue/Aside.svelte';
	import Main from '$lib/components/glue/Main.svelte';
	import PageContainer from '$lib/components/glue/PageContainer.svelte';
	import { currentUser, pb } from '$lib/glue/pocketbase';
	import ListingItem from '$lib/components/ListingItem.svelte';
	import { onMount } from 'svelte';
	import IconMessage from '$lib/icons/glue/IconMessage.svelte';

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
		<div class="hidden space-y-3 rounded-lg bg-base-200 p-4 fixed md:block w-[290px]">
			<p class="font-semibold text-base-content/90">Welcome to ThriftHub! &#129297;</p>
			<div class="space-y-1 text-base-content/70">
				<p class="text-sm text-divider">The localized marketplace for Cornell, designed for clothing and item resale!</p>
				<p class="text-sm">Share suggestions and feedback to: 
					<a target="_blank" href="mailto:thrifthub.webdev@gmail.com" class="unselectable transition-colors hover:text-gray-400">
						<svg style="margin-bottom: 2px; display: inline;" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
							<path fill="currentColor" d="M4 20q-.825 0-1.412-.587Q2 18.825 2 18V6q0-.825.588-1.412Q3.175 4 4 4h16q.825 0 1.413.588Q22 5.175 
							22 6v12q0 .825-.587 1.413Q20.825 20 20 20ZM20 8l-7.475 4.675q-.125.075-.263.112q-.137.038-.262.038t-.262-.038q-.138-.037-.263-.112L4 
							8v10h16Zm-8 3l8-5H4ZM4 8v.25v-1.475v.025V6v.8v-.013V8.25V8v10Z"/>
						</svg>
						thrifthub.webdev@gmail.com
					</a>
				</p>
				
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

<!-- custom styles -->
<style>
	.unselectable {
		user-select: none;
	}
	
	.text-divider {
		border-bottom-width: 1px;
		padding-bottom: 10px;
		margin-bottom: 10px;
		border-color: #A6ADBAB2
	}
</style>