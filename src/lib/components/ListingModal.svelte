<script lang="ts">
	import { goto } from '$app/navigation';
	import { pb, currentUser } from '$lib/glue/pocketbase';
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
	<input type="checkbox" id="modal-listing-{listing?.id}" class="modal-toggle" />
	<label for="modal-listing-{listing?.id}" class="modal cursor-pointer">
		<label class="modal-box relative w-[80vw] max-w-none md:w-[60vw]" for="">
			<div class="flex w-full justify-center">
				<div class=" w-full space-y-4">
					<!-- carousel -->
					<div>
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
					</div>

					<!-- info -->
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

							<!-- message button (desktop) -->
							<div class="hidden md:block">
								<button
									class="btn-primary btn {isChatLoading && 'loading'}"
									on:click={handleChatClick}>Message seller</button
								>
							</div>
						</div>
					</div>

					<!-- message button (mobile) -->
					<div class="md:hidden">
						<button
							class="btn-primary btn-block btn mt-4 {isChatLoading && 'loading'}"
							on:click={handleChatClick}>Message seller</button
						>
					</div>
				</div>
			</div>
		</label>
	</label>
{/if}
