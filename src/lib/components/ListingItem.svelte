<script lang="ts">
	import { goto } from '$app/navigation';
	import { pb, currentUser } from '$lib/glue/pocketbase';
	import IconDownKarat from '$lib/icons/glue/IconDownKarat.svelte';
	import IconUpKarat from '$lib/icons/glue/IconUpKarat.svelte';
	import { formatDistanceToNowStrict } from 'date-fns';

	export let listing;

	let isExpanded = false;
	let isChatLoading = false;

	const handleChatClick = async () => {
		isChatLoading = true;

		try {
			const existingChatroom = await pb
				.collection('chatrooms')
				.getFirstListItem(
					`post="${listing?.id}"&&author="${listing?.user}"&&searcher="${$currentUser?.id}"`
				);

			goto(`/chatrooms/${existingChatroom?.id}`);
		} catch (error) {
			if (error?.status === 404) {
				const newChatroom = await pb.collection('chatrooms').create({
					post: listing?.id,
					author: listing?.user,
					searcher: $currentUser?.id
				});
				goto(`/chatrooms/${newChatroom?.id}`);
			}
		}

		isChatLoading = false;
	};
</script>

{#if listing}
	<div class="relative w-full py-2 md:w-[32rem]">
		<div class="flex space-x-4">
			<!-- photos -->
			<div>
				<img
					class="h-28 w-32 rounded object-cover"
					src={pb.getFileUrl(listing, listing?.photos[0])}
					alt=""
				/>
			</div>

			<!-- info -->
			<div class="mt-[-0.25rem]">
				<p class="text-lg font-semibold text-base-content/90">{listing?.title}</p>
				<p class="font-medium">${listing?.price}</p>
				<div class="mt-3 flex items-center space-x-2">
					<div class="avatar">
						<div class="w-6 rounded-full">
							<img src={listing?.expand?.user?.avatarUrl} alt="" />
						</div>
					</div>
					<p class="text-sm text-base-content/70">
						{formatDistanceToNowStrict(new Date(listing?.updated))} ago
					</p>
				</div>
			</div>
		</div>

		<!-- expanded content -->
		{#if isExpanded}
			<div class="mt-4 w-4/5 space-y-2">
				<p class="text-sm text-base-content/70">{listing?.desc}</p>
				<button
					class="btn-primary btn-block btn-sm btn {isChatLoading && 'loading'}"
					on:click={handleChatClick}>Message seller</button
				>
			</div>
		{/if}

		<!-- expand / collapse button -->
		<div class="absolute right-1 bottom-1">
			<button
				class="btn-sm btn rounded-full px-1 text-2xl"
				on:click={() => {
					isExpanded = !isExpanded;
				}}
			>
				{#if isExpanded}
					<IconUpKarat />
				{:else}
					<IconDownKarat />
				{/if}
			</button>
		</div>
	</div>
{/if}
