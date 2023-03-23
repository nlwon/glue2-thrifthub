<script>
	import Aside from '$lib/components/glue/Aside.svelte';
	import Main from '$lib/components/glue/Main.svelte';
	import PageContainer from '$lib/components/glue/PageContainer.svelte';
	import ListingForm from '$lib/components/ListingForm.svelte';
</script>

<div class="py-4">
	<PageContainer title="New Listing" layout="aside-main">
		<Main>
			<div class="space-y-4">
				<h2 class="text-4xl font-semibold">New Listing</h2>
				<ListingForm />
			</div>
		</Main>
		<Aside />
	</PageContainer>
</div>
