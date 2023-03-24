<script>
	import { pb } from '$lib/glue/pocketbase';
	import ListingModal from './ListingModal.svelte';

	export let chatroom;

	$: listing = chatroom?.expand?.post;
</script>

{#if listing}
	<div class="">
		<label for="modal-listing-{listing?.isSold ? 'disabled' : listing?.id}">
			<div
				class="{listing?.isSold &&
					'cursor-default'} flex cursor-pointer items-start space-x-3 rounded-xl py-2 px-2 hover:bg-base-200"
			>
				<!-- thumbnail -->
				<div class="">
					<img
						class="h-10 w-10 rounded object-cover {listing?.isSold && 'opacity-50'}"
						src={pb.getFileUrl(listing, listing?.photos[listing?.thumbnailIdx || 0], {
							thumb: '800x0'
						})}
						alt=""
					/>
				</div>

				<!-- desc -->
				<div>
					<div class="flex items-center space-x-2">
						{#if listing?.isSold}
							<div class="badge-error badge badge-sm">Sold</div>
						{/if}
						<p class="text-sm font-medium">
							{chatroom?.expand?.author?.name?.split(' ')[0]} • {listing?.title}
						</p>
					</div>
					<p class="text-xs font-medium">${listing?.price}</p>
				</div>
			</div>
		</label>
	</div>

	<ListingModal {listing} />
{/if}
