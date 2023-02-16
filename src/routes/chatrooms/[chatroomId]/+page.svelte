<script>
	import { page } from '$app/stores';
	import Aside from '$lib/components/glue/Aside.svelte';
	import ChatPanel from '$lib/components/glue/chat/ChatPanel.svelte';
	import MyChatroomList from '$lib/components/glue/chat/MyChatroomList.svelte';
	import Main from '$lib/components/glue/Main.svelte';
	import PageContainer from '$lib/components/glue/PageContainer.svelte';
	import { pb } from '$lib/glue/pocketbase';

	let chatroomId = null;
	let chatroom = null;

	const fetchChatroom = async (pathname) => {
		if (pathname) {
			chatroomId = pathname?.split('/')[2];
			try {
				chatroom = await pb.collection('chatrooms').getOne(chatroomId, {
					expand: 'author,searcher,post'
				});
			} catch (error) {
				if (error?.status !== 404) throw error;
			}
		}
	};

	$: fetchChatroom($page?.url?.pathname);
</script>

<PageContainer title="Chatroom" layout="aside-main">
	<Aside>
		<div class="hidden md:block">
			<MyChatroomList activeChatroomId={chatroomId} />
		</div>
	</Aside>
	<Main>
		<ChatPanel {chatroom} />
	</Main>
</PageContainer>
