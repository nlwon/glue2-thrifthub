<script>
	import { page } from '$app/stores';
	import Aside from '$lib/components/glue/Aside.svelte';
	import Chatroom from '$lib/components/glue/chat/Chatroom.svelte';
	import MyChatroomList from '$lib/components/glue/chat/MyChatroomList.svelte';
	import Main from '$lib/components/glue/Main.svelte';
	import PageContainer from '$lib/components/glue/PageContainer.svelte';
	import { pb } from '$lib/glue/pocketbase';
	import { onMount } from 'svelte';

	const chatroomId = $page?.url?.pathname?.split('/')[2];
	let chatroom = null;

	onMount(async () => {
		chatroom = await pb.collection('chatrooms').getOne(chatroomId, {
			expand: 'author,searcher,post'
		});
	});
</script>

<PageContainer title="Chatroom" layout="aside-main">
	<Aside>
		<div class="hidden md:block">
			<MyChatroomList />
		</div>
	</Aside>
	<Main>
		<Chatroom {chatroom} />
	</Main>
</PageContainer>
