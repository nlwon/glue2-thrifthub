<script lang="ts">
	import Aside from '$lib/components/glue/Aside.svelte';
	import Main from '$lib/components/glue/Main.svelte';
	import PageContainer from '$lib/components/glue/PageContainer.svelte';
</script>

<PageContainer title="Home" layout="aside-main">
	
	<Aside>test</Aside>
	<Main>main</Main>
</PageContainer>
