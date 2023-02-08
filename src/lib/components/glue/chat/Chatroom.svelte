<script>
	import { currentUser, pb } from '$lib/glue/pocketbase';
	import getOtherUser from '$lib/util/glue/chat/getOtherUser';
	import { format } from 'date-fns';
	import { onMount } from 'svelte';
	import TextInput from '../TextInput.svelte';

	export let chatroom;

	let chats = [];
	let content = '';

	const fetchChats = async () => {
		console.log('chatroom?.id', chatroom?.id);
		chats = await pb.collection('chats').getFullList(200, {
			filter: `chatroom="${chatroom?.id}"`,
			sort: 'created',
			expand: 'sender,receiver'
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
	$: console.log('chats', chats);
</script>

{#if chatroom}
	{#each chats as chat (chat?.id)}
		<div class={`chat ${chat?.sender === $currentUser?.id ? 'chat-end' : 'chat-start'}`}>
			<div class="chat-image avatar">
				<div class="w-10 rounded-full">
					<img src={chat?.expand?.sender?.avatarUrl} />
				</div>
			</div>
			<div class="chat-header mb-2">
				{chat?.expand?.sender?.name}
				<time class="ml-1 text-xs opacity-50">{format(new Date(chat?.created), 'hh:mm aaa')}</time>
			</div>
			<div class="chat-bubble">{chat?.content}</div>
		</div>
	{/each}
	<div class="fixed bottom-0 left-0 right-0 bg-base-300 p-4">
		<form on:submit={handleCreateChat} class="flex items-center space-x-2">
			<TextInput bind:value={content} class="input-sm" placeholder="Enter message here" />
			<button class="btn-primary btn-sm btn">Send</button>
		</form>
	</div>
{/if}
