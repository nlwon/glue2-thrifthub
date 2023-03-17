<script lang="ts">
	import { goto } from '$app/navigation';
	import { currentUser, pb } from '$lib/glue/pocketbase';
	import IconEditPen from '$lib/icons/glue/IconEditPen.svelte';
	import IconMessage from '$lib/icons/glue/IconMessage.svelte';
	import { formatDistanceToNowStrict } from 'date-fns';
	import ListingModal from './ListingModal.svelte';

	export let listing;

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
	<!-- listing card -->
	<label for="modal-listing-{listing?.isSold ? 'disabled' : listing?.id}">
		<div
			class="relative w-full cursor-pointer rounded-xl py-3 hover:bg-base-200 md:w-[32rem] md:px-2 {listing?.isSold &&
				'cursor-default hover:bg-base-100'}"
		>
			<div class="flex w-full space-x-4">
				<!-- thumbnail -->
				<div class="flex-shrink-0">
					<img
						class="h-28 w-28 rounded object-cover md:w-32 {listing?.isSold && 'opacity-50'}"
						src={pb.getFileUrl(listing, listing?.photos[listing?.thumbnailIdx || 0])}
						alt=""
					/>
				</div>

				<!-- info -->
				<div class="mt-[-0.25rem] flex-1">
					<div class="flex w-full justify-between">
						<div>
							{#if listing?.isSold}
								<div class="badge badge-error mb-1 ml-[-0.25rem]">Sold</div>
							{/if}
							<p
								class="text-lg font-semibold text-base-content/90 {listing?.isSold && 'opacity-50'}"
							>
								{listing?.title}
							</p>
							<p class="font-medium {listing?.isSold && 'opacity-50'}">${listing?.price}</p>
						</div>

						{#if listing?.user === $currentUser?.id}
							<!-- edit button -->
							<a href="/edit/{listing?.id}">
								<button class="btn-primary btn-sm btn-circle btn h-[2.5rem] w-[2.5rem] text-lg"
									><IconEditPen /></button
								>
							</a>
						{:else if !listing?.isSold}
							<!-- message button -->
							<button
								class="btn-primary btn-sm btn-circle btn h-[2.5rem] w-[2.5rem] text-lg"
								on:click={handleChatClick}><IconMessage /></button
							>
						{/if}
					</div>
					<div class="mt-3 flex items-center space-x-2">
						<div class="avatar">
							<div class="w-6 rounded-full {listing?.isSold && 'opacity-50'}">
								<img src={listing?.expand?.user?.avatarUrl} alt="" />
							</div>
						</div>
						<p class="text-sm text-base-content/70">
							Updated {formatDistanceToNowStrict(new Date(listing?.updated))} ago
						</p>
					</div>
					{#if !listing?.isSold}
						<p class="mt-2 text-sm text-base-content/70 line-clamp-1">
							{listing?.desc}
						</p>
					{/if}
				</div>
			</div>
		</div>
	</label>

	<ListingModal {listing} />
{/if}
