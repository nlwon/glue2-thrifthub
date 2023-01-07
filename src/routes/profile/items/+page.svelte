<script>
	import PageContainer from '$lib/glue/components/PageContainer.svelte';
	import { currentUser, pb } from '$lib/glue/pocketbase';
	import { onMount } from 'svelte';

	let items = [];

	const fetchMyItems = async () => {
		if ($currentUser) {
			items = await pb.collection('items').getFullList(200, {
				user: $currentUser,
				expand: 'user'
			});
		}
	};

	onMount(fetchMyItems);
</script>

<PageContainer>
	<div class="space-y-4">
		<p class="ml-2 text-3xl font-semibold">My items</p>
		<div class="space-y-2">
			{#each items as item (item?.id)}
				<a href={`/item/edit/${item?.id}`}>
					<div class="flex space-x-4 rounded-xl p-2 hover:bg-base-200">
						<img
							class="h-[120px] w-[150px] flex-shrink-0 rounded-xl object-cover"
							src={pb.getFileUrl(item, item?.photos[0], { thumb: '300x0' })}
							alt=""
							width="150"
							height="120"
						/>
						<div class="flex h-[120px] w-full flex-col justify-between">
							<div class="space-y-1">
								<p class="text-xl ">{item?.name}</p>
								<p class="text font-medium">{item?.expand?.user?.name}</p>
							</div>
							<p class="text-xl font-bold">${item?.price}</p>
						</div>
					</div>
				</a>
			{/each}
		</div>
	</div>
</PageContainer>
