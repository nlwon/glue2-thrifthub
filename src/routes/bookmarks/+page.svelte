<script>
	import Aside from '$lib/components/glue/Aside.svelte';
	import Main from '$lib/components/glue/Main.svelte';
	import PageContainer from '$lib/components/glue/PageContainer.svelte';
	import ProfileNavs from '$lib/components/ProfileNavs.svelte';
</script>

<PageContainer title="My Listings" layout="aside-main">
	<Aside>
		<ProfileNavs />
	</Aside>
	<Main>
		<div class="space-y-4">
			<h2 class="text-2xl font-semibold tracking-wider">Bookmarks</h2>
			<p>Bookmarks feature coming soon!</p>
		</div>
	</Main>
</PageContainer>
