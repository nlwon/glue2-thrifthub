<script>
	import Aside from '$lib/components/glue/Aside.svelte';
	import MyChatroomList from '$lib/components/glue/chat/MyChatroomList.svelte';
	import Main from '$lib/components/glue/Main.svelte';
	import PageContainer from '$lib/components/glue/PageContainer.svelte';
	import ProfileNavs from '$lib/components/ProfileNavs.svelte';
</script>

<PageContainer layout="aside-main" title="Messages">
	<Aside>
		<ProfileNavs />
		<MyChatroomList />
	</Aside>

	<!-- no chatroom selected, leave main blank -->
	<Main />
</PageContainer>
