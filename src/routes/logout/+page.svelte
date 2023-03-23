<script>
	import { goto } from '$app/navigation';
	import Aside from '$lib/components/glue/Aside.svelte';
	import Main from '$lib/components/glue/Main.svelte';
	import PageContainer from '$lib/components/glue/PageContainer.svelte';
	import ProfileNavs from '$lib/components/ProfileNavs.svelte';
	import { pb } from '$lib/glue/pocketbase';

	const signOut = () => {
		pb.authStore.clear();
		goto('/');
	};
</script>

<PageContainer title="My listings" layout="aside-main">
	<Aside>
		<ProfileNavs />
	</Aside>
	<Main>
		<div class="space-y-4">
			<h2 class="text-2xl font-semibold tracking-wider">Log Out</h2>
			<button class="btn-sm btn" on:click={signOut}>Log out of ThriftHub</button>
		</div>
	</Main>
</PageContainer>
