<script lang="ts">
	import { goto } from '$app/navigation';
	import { currentUser, pb } from '$lib/glue/pocketbase';
	import { formatDistanceToNowStrict } from 'date-fns';

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
	<label for="modal-listing-{listing?.id}">
		<div class="relative w-full cursor-pointer rounded-xl py-3 px-2 hover:bg-base-200 md:w-[32rem]">
			<div class="flex space-x-4">
				<!-- photos -->
				<div class="flex-shrink-0">
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
							Updated {formatDistanceToNowStrict(new Date(listing?.updated))} ago
						</p>
					</div>
					<p class="mt-2 text-sm text-base-content/70 line-clamp-1">
						{listing?.desc}
					</p>
				</div>
			</div>
		</div>
	</label>

	<!-- listing modal -->
	<input type="checkbox" id="modal-listing-{listing?.id}" class="modal-toggle" />
	<label for="modal-listing-{listing?.id}" class="modal cursor-pointer">
		<label class="modal-box relative w-[80vw] max-w-none md:w-[60vw]" for="">
			<div class="flex justify-center">
				<div class=" space-y-4 ">
					<div class="carousel-center carousel rounded-box h-[40vh] space-x-4 bg-neutral p-4">
						{#each listing?.photos as photo}
							<div class="carousel-item">
								<img
									src={pb.getFileUrl(listing, photo)}
									class="rounded-box w-[50vw] object-cover md:w-[30vw]"
									alt=""
								/>
							</div>
						{/each}
					</div>
					<div class="space-y-1">
						<h3 class="text-2xl font-semibold">{listing?.title}</h3>
						<p class="text-lg font-semibold">${listing?.price}</p>
						<div class="flex items-end justify-between">
							<div class="space-y-2">
								<p class="font-medium text-base-content/70">
									Updated {formatDistanceToNowStrict(new Date(listing?.updated))} ago
								</p>
								<p class="text-sm text-base-content/70">
									{listing?.desc}
								</p>
							</div>
							<button class="btn-primary btn hidden md:block" on:click={handleChatClick}
								>Message seller</button
							>
						</div>
					</div>
					<button class="btn-primary btn-block btn mt-4 md:hidden" on:click={handleChatClick}
						>Message seller</button
					>
				</div>
			</div>
		</label>
	</label>
{/if}
