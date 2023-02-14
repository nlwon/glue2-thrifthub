<script lang="ts">
	import { currentUser, pb } from '$lib/glue/pocketbase';
	import getOtherUser from '$lib/util/glue/chat/getOtherUser';
	import { format } from 'date-fns';
	import { onDestroy, onMount } from 'svelte';
	import TextInput from '../TextInput.svelte';

	export let chatroom;

	let chatGroups = [];
	let content = '';
	let unsubscribe: () => void;
	let prevChatUser = null;
	let prevDateString = null;

	const appendChat = (chat) => {
		const chatDateString = format(new Date(chat?.created), 'MMM dd');

		if (!prevChatUser || prevDateString !== chatDateString) {
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

		prevChatUser = chat?.sender;
		prevDateString = chatDateString;
	};

	const fetchChats = async () => {
		const chatDocs = await pb.collection('chats').getFullList(200, {
			filter: `chatroom="${chatroom?.id}"`,
			sort: 'created',
			expand: 'sender,receiver'
		});

		chatGroups = [];

		chatDocs?.forEach((chat) => {
			appendChat(chat);
		});
	};

	$: {
		if (chatroom) {
			fetchChats();
		}
	}

	const handleCreateChat = async () => {
		pb.collection('chats').create({
			variant: 'text',
			content,
			chatroom: chatroom?.id,
			sender: $currentUser?.id,
			receiver: getOtherUser({ chatroom, user: $currentUser })
		});
		content = '';
	};

	const subscribeToChats = async () => {
		unsubscribe = await pb.collection('chats').subscribe('*', async ({ action, record }) => {
			if (action === 'create') {
				appendChat(record);
			}
		});
	};

	const chatGroupName = (group) => {
		return group?.sender === chatroom?.author?.id
			? chatroom?.expand?.author?.name
			: chatroom?.expand?.searcher?.name;
	};

	onMount(() => {
		subscribeToChats();
	});

	onDestroy(() => {
		unsubscribe?.();
	});

	$: console.log('chatroom', chatroom);
	$: console.log('chatGroups', chatGroups);
</script>

<div class="border-3 rounded border border-base-content/10">
	{#if chatroom}
		{#each chatGroups as group (group?.id)}
			{#if group?.variant === 'datestamp'}
				<div class="divider mt-0 mb-2 text-sm">{group?.content}</div>
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
		<div class="fixed bottom-0 left-0 right-0 bg-base-300 p-4">
			<form on:submit={handleCreateChat} class="flex items-center space-x-2">
				<TextInput bind:value={content} class="input" placeholder="Type a message" autofocus />
				<button class="btn-primary btn">Send</button>
			</form>
		</div>
	{/if}
</div>
