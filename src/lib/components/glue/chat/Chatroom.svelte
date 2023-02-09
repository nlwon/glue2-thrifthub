<script>
	import { currentUser, pb } from '$lib/glue/pocketbase';
	import getOtherUser from '$lib/util/glue/chat/getOtherUser';
	import { format } from 'date-fns';
	import { onMount } from 'svelte';
	import TextInput from '../TextInput.svelte';

	export let chatroom;

	let chatGroups = [];
	let content = '';

	const fetchChats = async () => {
		const chatDocs = await pb.collection('chats').getFullList(200, {
			filter: `chatroom="${chatroom?.id}"`,
			sort: 'created',
			expand: 'sender,receiver'
		});
		console.log('chatDocs', chatDocs);

		let prevChatUser = null;
		let prevDateString = null;
		chatGroups = [];

		chatDocs?.forEach((chat) => {
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
				chatGroups[chatGroups?.length - 1]?.items?.push(chat);
			}

			prevChatUser = chat?.sender;
			prevDateString = chatDateString;
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
	$: console.log('chatroom', chatroom);
	$: console.log('chatGroups', chatGroups);
</script>

{#if chatroom}
	{#each chatGroups as group (group?.id)}
		{#if group?.variant === 'datestamp'}
			<div class="divider mt-0 mb-2 text-sm">{group?.content}</div>
		{:else}
			<div class={`chat ${group?.sender === $currentUser?.id ? 'chat-end' : 'chat-start'}`}>
				<div class="chat-header mb-2">
					{group?.expand?.sender?.name}
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
			<TextInput bind:value={content} class="input" placeholder="Enter message here" />
			<button class="btn-primary btn">Send</button>
		</form>
	</div>
{/if}
