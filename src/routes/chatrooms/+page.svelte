<script>
	import Aside from '$lib/components/glue/Aside.svelte';
	import MyChatroomList from '$lib/components/glue/chat/MyChatroomList.svelte';
	import Main from '$lib/components/glue/Main.svelte';
	import PageContainer from '$lib/components/glue/PageContainer.svelte';
</script>

<PageContainer layout="aside-main" title="My messages">
	<Aside>
		<MyChatroomList />
	</Aside>

	<!-- no chatroom selected, leave main blank -->
	<Main />
</PageContainer>
