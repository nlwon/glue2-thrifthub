<script lang="ts">
	import { pb, currentUser } from '$lib/glue/pocketbase';
	import IconRightArrowLong from '$lib/icons/glue/IconRightArrowLong.svelte';
	import getOtherUser from '$lib/util/glue/chat/getOtherUser';
	import dynamicAgo from '$lib/util/glue/dynamicAgo';
	import { onDestroy, onMount } from 'svelte';

	export let activeChatroomId;
	let chatrooms = [];
	let unsubscribe: () => void;

	const appendChat = async (chat) => {
		try {
			let existingChatroom = null;
			const filteredChatrooms = chatrooms?.filter((chatroom) => {
				if (chatroom?.id === chat?.chatroom) {
					existingChatroom = chatroom;
				}
				return chatroom?.id !== chat?.chatroom;
			});

			if (existingChatroom) {
				// prepend existing chatroom
				chatrooms = [
					{
						...existingChatroom,
						latestChat: chat
					},
					...filteredChatrooms
				];
			} else {
				// new chatroom
				const newChatroom = await pb.collection('chatrooms').getOne(chat?.chatroom, {
					expand: 'author,searcher,post'
				});
				chatrooms = [
					{
						...newChatroom,
						otherUser: getOtherUser({
							chatroom: newChatroom,
							user: $currentUser,
							isExpanded: true
						}),
						latestChat: chat
					},
					...filteredChatrooms
				];
			}
		} catch (error) {}
	};

	const subscribeToChats = async () => {
		try {
			unsubscribe = await pb.collection('chats').subscribe('*', async ({ action, record }) => {
				if (
					action === 'create' &&
					(record?.sender === $currentUser?.id || record?.receiver === $currentUser?.id)
				) {
					appendChat(record);
				}
			});
		} catch (error) {}
	};

	const fetchChatrooms = async () => {
		try {
			const chatroomDocs = await pb.collection('chatrooms').getFullList(200, {
				filter: `author="${$currentUser?.id}"||searcher="${$currentUser?.id}"`,
				expand: 'author,searcher,post'
			});

			const chatroomPromises = chatroomDocs?.map(async (chatroom) => {
				try {
					const latestChat = await pb
						.collection('chats')
						.getFirstListItem(`chatroom="${chatroom?.id}"`, {
							sort: '-created'
						});

					return {
						...chatroom,
						otherUser: getOtherUser({ chatroom, user: $currentUser, isExpanded: true }),
						latestChat
					};
				} catch (error) {
					return null;
				}
			});
			chatrooms = (await Promise.all(chatroomPromises))
				?.filter((chatroom) => chatroom && chatroom?.latestChat)
				?.sort(
					(a, b) =>
						new Date(b?.latestChat?.created)?.getTime() -
						new Date(a?.latestChat?.created)?.getTime()
				);
		} catch (error) {}
	};

	onMount(() => {
		subscribeToChats();
		fetchChatrooms();
	});

	onDestroy(() => {
		unsubscribe?.();
	});
</script>

<div class="h-[70vh] rounded border-base-content/20 md:h-[80vh] md:border">
	<div class="space-y-2 pl-4 pb-2 md:p-4">
		<p class="text-2xl font-semibold">Messages</p>
		<p class="text-sm text-base-content/70 md:text-xs">
			You'll receive an email notification when someone messages you!
		</p>
	</div>
	{#each chatrooms as chatroom (chatroom?.id)}
		<a href={`/chatrooms/${chatroom?.id}`}>
			<div
				class={`border-b border-base-content/20 p-4 pt-2 ${
					activeChatroomId === chatroom?.id && 'bg-base-300'
				}`}
			>
				<div class="flex items-center space-x-3">
					<!-- avatar -->
					<div class="avatar">
						<div class="w-12 rounded-full">
							<img src={chatroom?.otherUser?.avatarUrl} />
						</div>
					</div>

					<!-- info text -->
					<div class="space-y-0.5 overflow-hidden">
						<!-- top: name, origin, destination -->
						<div class="flex items-center">
							<p class="truncate font-medium">
								{chatroom?.otherUser?.name}
							</p>
						</div>

						<!-- middle: recent chat -->
						<p class="truncate text-xs text-base-content/90">
							{chatroom?.latestChat?.sender === $currentUser?.id ? 'You: ' : ''}{chatroom
								?.latestChat?.content}
						</p>

						<!-- bottom: date -->
						<p class="w-full truncate text-xs text-base-content/70">
							{dynamicAgo({ date: new Date(chatroom?.latestChat?.created) })}
						</p>
					</div>
				</div>
			</div>
		</a>
	{/each}
</div>
