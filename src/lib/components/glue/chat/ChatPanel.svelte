<script lang="ts">
	import { currentUser, pb } from '$lib/glue/pocketbase';
	import getOtherUser from '$lib/util/glue/chat/getOtherUser';
	import { format } from 'date-fns';
	import { onDestroy, onMount } from 'svelte';
	import BackButton from '../BackButton.svelte';
	import TextInput from '../TextInput.svelte';
	import ChatPanelContent from '../../ChatPanelContent.svelte';

	export let chatroom;

	let chatGroups = [];
	let content = '';
	let unsubscribe: () => void;
	let prevChatUser = null;
	let prevDateString = null;
	let innerWidth = 0;

	const appendChat = (chat) => {
		const chatDateString = format(new Date(chat?.created), 'MMM dd');

		if (chatGroups?.length === 0 || !prevChatUser || prevDateString !== chatDateString) {
			// first chat group || new date, new chat group
			chatGroups?.push({
				id: chatDateString,
				variant: 'datestamp',
				content: chatDateString
			});
			chatGroups?.push({
				...chat,
				items: [chat]
			});
		} else if (prevChatUser !== chat?.sender) {
			// non-consecutive sender, new chat group
			chatGroups?.push({
				...chat,
				items: [chat]
			});
		} else {
			// consecutive sender, append to group
			chatGroups[chatGroups?.length - 1]?.items?.push(chat);
			chatGroups[chatGroups?.length - 1].id = chat?.id; // update group id to force rerender
		}

		chatGroups = [...chatGroups];
		prevChatUser = chat?.sender;
		prevDateString = chatDateString;
	};

	const fetchChats = async () => {
		try {
			const chatDocs = await pb.collection('chats').getFullList(200, {
				filter: `chatroom="${chatroom?.id}"`,
				sort: 'created',
				expand: 'sender,receiver'
			});

			chatGroups = [];

			chatDocs?.forEach((chat) => {
				appendChat(chat);
			});
		} catch (error) {}
	};

	$: {
		if (chatroom) {
			fetchChats();
		}
	}

	const handleCreateChat = async () => {
		try {
			const receiver = getOtherUser({ chatroom, user: $currentUser });
			const chatContent = content;

			// reset input value first to make it feel more performant
			content = '';

			pb.collection('chats').create({
				variant: 'text',
				content: chatContent,
				chatroom: chatroom?.id,
				sender: $currentUser?.id,
				receiver
			});

			await fetch('/api/email', {
				method: 'POST',
				body: JSON.stringify({
					senderName: $currentUser?.name,
					receiverId: receiver,
					content: chatContent
				}),
				headers: {
					'content-type': 'application/json'
				}
			});
		} catch (error) {}
	};

	const subscribeToChats = async () => {
		try {
			unsubscribe = await pb.collection('chats').subscribe('*', async ({ action, record }) => {
				if (record?.chatroom === chatroom?.id && action === 'create') {
					appendChat(record);
				}
			});
		} catch (error) {}
	};

	const chatGroupName = (group) => {
		return group?.sender === chatroom?.author
			? chatroom?.expand?.author?.name
			: chatroom?.expand?.searcher?.name;
	};

	onMount(() => {
		subscribeToChats();
	});

	onDestroy(() => {
		unsubscribe?.();
	});
</script>

<svelte:window bind:innerWidth />

<div class="relative h-[70vh] overflow-hidden rounded border border-base-content/20 md:h-[80vh]">
	<!-- top panel -->
	<div
		class="absolute left-0 right-0 z-10 flex h-16 items-center space-x-3 border-b border-base-content/20 bg-base-100 px-3 py-2"
	>
		<BackButton isRenderLabel={false} class="btn-sm mr-0.5 px-2 text-2xl md:hidden" />
		<ChatPanelContent {chatroom} />
	</div>

	<!-- top panel height placeholder -->
	<div class="h-16" />

	<!-- chat content -->
	<div
		class="chat-content-container relative flex flex-1 snap-y snap-proximity flex-col-reverse overflow-y-auto overscroll-y-contain pr-2 pt-0 [&>div>div:last-child]:snap-end"
	>
		<div class="">
			{#if chatroom}
				{#each chatGroups as group (group?.id)}
					{#if group?.variant === 'datestamp'}
						<div class="divider mt-4 mb-3 text-sm">{group?.content}</div>
					{:else}
						<div class={`chat ${group?.sender === $currentUser?.id ? 'chat-end' : 'chat-start'}`}>
							<div class="chat-header mb-2">
								{chatGroupName(group)}
								<time class="ml-1 text-xs opacity-50"
									>{format(new Date(group?.created), 'hh:mm aaa')}</time
								>
							</div>
							{#each group?.items as item (item?.id)}
								<div class="chat-bubble mb-2">{item?.content}</div>
							{/each}
						</div>
					{/if}
				{/each}
			{/if}
		</div>
	</div>

	<!-- bottom panel: message input -->
	<form
		on:submit={handleCreateChat}
		class="absolute left-0 right-0 bottom-0 z-10 h-20 bg-base-100 p-4"
	>
		<TextInput
			bind:value={content}
			class="input rounded-full border-base-content/40"
			placeholder="Type a message"
			autofocus={innerWidth >= 768 || undefined}
		/>
	</form>
</div>

<style>
	.chat-content-container {
		/* subtracts height of top, bottom panels */
		height: calc(100% - 9rem);
	}
</style>
