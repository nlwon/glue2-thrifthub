<script lang="ts">
	import { goto } from '$app/navigation';
	import { currentUser, pb } from '$lib/glue/pocketbase';
	import IconDelete from '$lib/icons/glue/IconDelete.svelte';
	import { onMount } from 'svelte';
	import Textarea from './glue/Textarea.svelte';
	import TextInput from './glue/TextInput.svelte';

	export let initialValues;

	let isLoading = false;
	let isDeleteLoading = false;
	let isMarkAsSoldLoading = false;

	const formData = new FormData();

	let title: string = '';
	let price: number = 0;
	let desc: string = '';
	let photos: File[] = []; // should only contain new photos
	let previews: string[] = [];
	let thumbnailIdx = 0;
	let deletedExistingPhotos: string[] = [];
	let errors;

	const handleFileChange = (event) => {
		photos = [...photos, ...event?.target?.files];

		for (let photo of event?.target?.files) {
			(function (file) {
				const reader = new FileReader();
				reader.addEventListener('load', function () {
					previews = [...previews, reader.result as string];
				});
				reader.readAsDataURL(file);
			})(photo);
		}
	};

	const handleCreateListing = async () => {
		isLoading = true;

		try {
			formData.set('title', title);
			formData.set('price', String(price));
			formData.set('desc', desc);
			formData.set('thumbnailIdx', String(thumbnailIdx));
			formData.set('user', $currentUser.id);

			for (let photo of photos) {
				formData.append('photos', photo);
			}

			// TODO: delete existing photos that were deleted

			if (initialValues) {
				await pb.collection('listings').update(initialValues?.id, formData);
			} else {
				await pb.collection('listings').create(formData);
			}
			goto('/my-listings');
		} catch (error) {
			errors = error?.data?.data;
		} finally {
			isLoading = false;
		}
	};

	const setInitialValues = async () => {
		if (initialValues) {
			title = initialValues?.title;
			price = initialValues?.price;
			desc = initialValues?.desc;
			thumbnailIdx = initialValues?.thumbnailIdx || 0;
			previews = initialValues?.photos?.map((photo: string) => {
				return pb.getFileUrl(initialValues, photo);
			});
		}
	};

	const handleDeleteListing = async () => {
		isDeleteLoading = true;

		try {
			await pb.collection('listings').delete(initialValues?.id);
			goto('/my-listings');
		} catch (error) {}

		isDeleteLoading = false;
	};

	const handleMarkAsSold = async () => {
		isMarkAsSoldLoading = true;

		try {
			await pb.collection('listings').update(initialValues?.id, {
				isSold: true
			});
			goto('/my-listings');
		} catch (error) {}

		isMarkAsSoldLoading = false;
	};

	onMount(() => {
		setInitialValues();
	});
</script>

<form on:submit|preventDefault={handleCreateListing}>
	<div class="space-y-4">
		<div class="max-w-xs">
			<TextInput label="Title" bind:value={title} error={errors?.title?.message} />
		</div>
		<div class="max-w-xs">
			<TextInput
				label="Price ($)"
				type="number"
				bind:value={price}
				error={errors?.price?.message}
			/>
		</div>
		<div>
			<Textarea label="Description" bind:value={desc} />
		</div>
		<div class="space-y-4">
			<div class="space-y-2">
				<p class="text-xl font-semibold">
					Photos <span class="text-base-content/70">(5 max)</span>
				</p>
				{#if errors?.photos}
					<p class="text-sm text-error">{errors?.photos?.message}</p>
				{/if}
				<p class="text-sm text-base-content/80">
					Click on a photo to select it as the thumbnail photo.
				</p>
			</div>
			<input
				type="file"
				multiple
				class="file-input-bordered file-input w-full max-w-xs"
				on:change={handleFileChange}
			/>
			<div class="flex flex-wrap items-start">
				{#if previews}
					{#each previews as preview, idx (`${preview}${idx}`)}
						<button
							class="mx-1 my-2"
							type="button"
							on:click={() => {
								thumbnailIdx = idx;
							}}
						>
							<img
								src={preview}
								alt=""
								class="mb-1 h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-base-content/60 object-cover {idx ===
									thumbnailIdx && 'border-primary/70'}"
							/>
							{#if idx === thumbnailIdx}
								<div class="flex justify-center">
									<p class="text-xs font-semibold text-base-content/80">Thumbnail</p>
								</div>
							{:else}
								<!-- placeholder for thumbnail text space -->
								<div class="h-4" />
							{/if}
						</button>
					{/each}
				{/if}
			</div>
		</div>

		<!-- TODO: categories -->
	</div>

	<div class="mt-6 flex space-x-2 ">
		<button class="btn-primary btn {isLoading && 'loading'}" type="submit"
			>{initialValues ? 'Save' : 'Post'} listing</button
		>
		<button class="btn {isMarkAsSoldLoading && 'loading'}" type="button" on:click={handleMarkAsSold}
			>Mark as sold</button
		>
		<label for="modal-delete-listing" class="btn-error btn-ghost btn text-2xl text-error"
			><IconDelete /></label
		>
	</div>
	{#if errors}
		<p class="mt-1 text-sm text-error">There were errors in your submission</p>
	{/if}
</form>

<!-- delete confirmation modal -->
<input type="checkbox" id="modal-delete-listing" class="modal-toggle" />
<label for="modal-delete-listing" class="modal cursor-pointer">
	<label class="modal-box relative" for="">
		<h3 class="text-lg font-bold">Delete listing</h3>
		<div class="space-y-1 py-3">
			<p class="text-sm text-base-content/80">
				Are you sure you would like to delete your listing?
			</p>
			<p class="text-sm text-base-content/80">
				Your listing will be deleted permanantly and cannot be recovered.
			</p>
		</div>
		<div class="flex justify-end space-x-1">
			<label for="modal-delete-listing" class="btn-ghost btn">Cancel</label>
			<button
				type="button"
				class="btn-error btn {isDeleteLoading && 'loading'}"
				on:click={handleDeleteListing}>Delete</button
			>
		</div>
	</label>
</label>
