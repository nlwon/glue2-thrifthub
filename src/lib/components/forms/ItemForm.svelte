<script lang="ts">
	import { goto } from '$app/navigation';
	import Textarea from '$lib/glue/components/Textarea.svelte';
	import TextInput from '$lib/glue/components/TextInput.svelte';
	import { currentUser, pb } from '$lib/glue/pocketbase';
	import { onMount } from 'svelte';

	export let item = null;

	let isLoading = false;

	const formData = new FormData();
	let name = `test item ${Math.floor(Math.random() * 1000)}`;
	let price = '0';
	let desc =
		'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aliquam vero ea optio sint. Cupiditate veniam molestiae consectetur aliquam illo debitis.';

	onMount(() => {
		if (item) {
			name = item?.name;
			price = item?.price;
			desc = item?.desc;
		}
	});

	const handleSubmit = async () => {
		isLoading = true;
		if ($currentUser) {
			formData.append('name', name);
			formData.append('price', price);
			formData.append('desc', desc);
			formData.append('user', $currentUser?.id as string);
			let result;

			if (item) {
				result = await pb.collection('items').update(item?.id, formData);
			} else {
				result = await pb.collection('items').create(formData);
			}
			goto(`/item/${result?.id}`);
		}
		isLoading = false;
	};

	const handleFileChange = (event: any) => {
		for (let file of event?.target?.files) {
			formData.append('photos', file);
		}
	};

	let isLoadingDelete = false;

	const deleteItem = async () => {
		isLoadingDelete = true;
		await pb.collection('items').delete(item?.id);
		goto(`/profile/items`);
		isLoadingDelete = false;
	};
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-4">
	<h1 class="text-4xl font-semibold">{item ? `Edit ${item?.name}` : 'Sell items'}</h1>
	<p class="text-base-content/80">
		Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci sed totam reprehenderit
	</p>
	<TextInput label="Item name" bind:value={name} />
	<TextInput type="number" label="Price (USD)" bind:value={price} />
	<Textarea label="Description" bind:value={desc} class="h-48" />
	<input
		type="file"
		class="file-input-bordered file-input w-full max-w-xs"
		on:change={handleFileChange}
		multiple
	/>
	<div class="flex space-x-2">
		<button class={`btn-primary btn ${isLoading ? 'loading' : ''}`}
			>{item ? 'Save changes' : 'Add item'}</button
		>
		{#if item}
			<button type="button" class="btn" on:click={deleteItem}>Delete</button>
		{/if}
	</div>
</form>
