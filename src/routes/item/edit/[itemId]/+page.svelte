<script lang="ts">
	import ItemForm from '$lib/components/forms/ItemForm.svelte';
	import PageContainer from '$lib/glue/components/PageContainer.svelte';
	import { pb } from '$lib/glue/pocketbase';
	import { onMount } from 'svelte';

	export let data;

	const { itemId } = data;
	let item: any = null;

	const fetchItem = async () => {
		item = await pb.collection('items').getOne(itemId);
	};

	onMount(fetchItem);

	// const saveAvailability = (availability: TValue) => {
	// 	if (item?.id) {
	// 		pb.collection('items').update(item?.id, {
	// 			availability
	// 		});
	// 	}
	// };
	// const debouncedSaveAvailability = debounce(saveAvailability, 200);

	// $: debouncedSaveAvailability(item?.availability);
</script>

{#if item}
	<PageContainer title={item?.name}>
		<ItemForm {item} />
	</PageContainer>
{/if}
