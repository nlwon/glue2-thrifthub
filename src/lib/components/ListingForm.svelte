<script lang="ts">
	import { goto } from '$app/navigation';
	import { currentUser, pb } from '$lib/glue/pocketbase';
	import Checkbox from './glue/Checkbox.svelte';
	import Textarea from './glue/Textarea.svelte';
	import TextInput from './glue/TextInput.svelte';

	let isLoading = false;

	let title: string = '';
	let price: number = null;
	let desc: string = '';
	let photos;
	let previews: string[] = [];
	let categories = [];

	const updatePreviews = (photos) => {
		if (photos) {
			previews = [];

			for (const photo of photos) {
				(function (file) {
					const reader = new FileReader();
					reader.addEventListener('load', function () {
						console.log('load new photo');
						// newPreviews?.push(reader.result as string);
						previews = [...previews, reader.result as string];
					});
					reader.readAsDataURL(file);
				})(photo);
			}
		}
	};

	$: updatePreviews(photos);

	$: console.log('previews', previews);

	const handleCreateListing = async () => {
		isLoading = true;

		try {
			const formData = new FormData();
			formData.append('title', title);
			formData.append('price', String(price)).place;
			formData.append('desc', desc);
			formData.append('user', $currentUser.id);

			for (let photo of photos) {
				formData.append('photos', photo);
			}

			await pb.collection('listings').create(formData);
			goto('/my-listings');
		} catch (error) {
			// TODO: form error handling
		} finally {
			isLoading = false;
		}
	};
</script>

<form on:submit|preventDefault={handleCreateListing}>
	<div class="space-y-4">
		<div class="max-w-xs">
			<TextInput label="Title" bind:value={title} />
		</div>
		<div class="max-w-xs">
			<TextInput placeholder="$0" label="Price ($)" type="number" bind:value={price} />
		</div>
		<div>
			<Textarea label="Description" bind:value={desc} />
		</div>
		<!-- TODO: photos -->
		<input
			type="file"
			multiple
			class="file-input-bordered file-input w-full max-w-xs"
			bind:files={photos}
		/>
		<div class="flex space-x-2">
			{#if previews}
				{#each previews as preview (preview)}
					<div>
						<img
							src={preview}
							alt=""
							class="h-24 w-24 overflow-hidden rounded-lg border border-base-content/60 object-cover"
						/>
					</div>
				{/each}
			{/if}
		</div>

		<!-- TODO: categories -->
	</div>

	<button class="btn-primary btn mt-6 {isLoading && 'loading'}" type="submit">Post listing</button>
</form>
