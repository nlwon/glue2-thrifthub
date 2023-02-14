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

		chatGroups = [...chatGroups];
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
			if (record?.chatroom === chatroom?.id && action === 'create') {
				appendChat(record);
			}
		});
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

	$: console.log('chatroom', chatroom);
	$: console.log('chatGroups', chatGroups);
</script>

<div class="relative rounded border border-base-content/20">
	<!-- top panel -->
	<div
		class="absolute left-0 right-0 z-10 flex items-center space-x-3 border-b border-base-content/20 bg-base-100 px-3 py-2"
	>
		<BackButton isRenderLabel={false} class="btn-sm px-2 text-2xl md:hidden" />
		<ChatPanelContent />
	</div>
	<div
		class="relative mt-[3rem] mb-[4.5rem] flex h-[60vh] flex-1 snap-y snap-proximity flex-col-reverse overflow-y-auto overscroll-y-contain pr-2 pt-0 md:h-[70vh] [&>div>div:last-child]:snap-end"
	>
		<div>
			{#if chatroom}
				<!-- chat messages -->
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
			{/if}
		</div>
	</div>
	<!-- bottom panel: message input -->
	<form on:submit={handleCreateChat} class="absolute left-0 right-0 bottom-0 z-10 bg-base-100 p-4">
		<TextInput
			bind:value={content}
			class="input rounded-full border-base-content/40"
			placeholder="Type a message"
			autofocus
		/>
	</form>
</div>
