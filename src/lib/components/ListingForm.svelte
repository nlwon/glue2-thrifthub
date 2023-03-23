<script lang="ts">
	import { goto } from '$app/navigation';
	import { currentUser, pb } from '$lib/glue/pocketbase';
	import IconClose from '$lib/icons/glue/IconClose.svelte';
	import IconDelete from '$lib/icons/glue/IconDelete.svelte';
	import { onMount } from 'svelte';
	import Textarea from './glue/Textarea.svelte';
	import TextInput from './glue/TextInput.svelte';

	export let initialValues;

	let isLoading = false;
	let isDeleteLoading = false;

	const formData = new FormData();

	let title: string = '';
	let price: number = 0;
	let desc: string = '';
	let photos: File[] = []; // should only contain new photos
	let previews: string[] = [];
	let isSold: boolean = false;
	let thumbnailIdx = 0;
	let deletedPhotosIdx: string[] = [];
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

			if (initialValues) {
				await pb.collection('listings').update(initialValues?.id, formData);

				if (deletedPhotosIdx?.length > 0) {
					const deleteObj = {};

					for (let i = 0; i < deletedPhotosIdx?.length; i++) {
						deleteObj[`photos.${deletedPhotosIdx[i]}`] = null;
					}
					await pb.collection('listings').update(initialValues?.id, {
						...deleteObj
					});
				}
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
			isSold = initialValues?.isSold;
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

	const toggleIsSold = async (event) => {
		isSold = !event?.target?.checked;

		try {
			await pb.collection('listings').update(initialValues?.id, {
				isSold: !event?.target?.checked
			});
		} catch (error) {}
	};

	const deletePhoto = (targetPreview, idx) => {
		const FILE_PATH_PREFIX = 'https://glue2-thrifthub.fly.dev/api/files/';

		previews.splice(idx, 1);
		previews = [...previews]; // to force svelte to rerender previews

		if (thumbnailIdx >= previews?.length) {
			thumbnailIdx = 0;
		}

		if (targetPreview?.includes(FILE_PATH_PREFIX)) {
			// existing photo that was uploaded to backend
			deletedPhotosIdx?.push(idx);
		} else {
			// new photo that's currently only in the user's machine
			const targetIdx = idx - initialValues?.photos?.length + deletedPhotosIdx?.length;
			photos?.splice(targetIdx, 1);
		}
	};

	onMount(() => {
		setInitialValues();
	});
</script>

<form on:submit|preventDefault={handleCreateListing}>
	<div class="space-y-8">
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
					{#each previews as preview, idx}
						<button
							class="relative mx-1 my-2"
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

							<!-- delete photo button -->
							<button
								type="button"
								class="btn-xs btn-circle btn absolute -right-2 -top-2"
								on:click={() => deletePhoto(preview, idx)}
							>
								<IconClose />
							</button>
						</button>
					{/each}
				{/if}
			</div>
		</div>

		{#if initialValues}
			<div class="space-y-4">
				<div class="space-y-2">
					<p class="text-xl font-semibold">Availability</p>
					<p class="text-sm text-base-content/70">
						Mark your listing as sold if you've sold the item and wish to no longer receive messages
						from buyers.
					</p>
				</div>
				<div class="flex items-center space-x-3">
					<input
						type="checkbox"
						class="toggle-success toggle"
						checked={!isSold}
						on:change={toggleIsSold}
					/>
					<p class="text-sm font-semibold">{isSold ? 'Sold' : 'Available'}</p>
				</div>
			</div>
		{/if}

		<!-- TODO: categories -->
	</div>

	<div class="mt-10 flex space-x-2 ">
		<button class="btn-primary btn {isLoading && 'loading'}" type="submit"
			>{initialValues ? 'Save' : 'Post'} listing</button
		>
		<label for="modal-delete-listing" class="btn-outline btn text-2xl"><IconDelete /></label>
	</div>
	{#if errors}
		<p class="mt-1 text-sm text-error">There were errors in your submission</p>
	{/if}
</form>

<!-- delete confirmation modal -->
<input type="checkbox" id="modal-delete-listing" class="modal-toggle" />
<label for="modal-delete-listing" class="modal cursor-pointer">
	<label class="modal-box relative" for="">
		<h3 class="text-lg font-bold">Delete Listing</h3>
		<div class="space-y-1 py-3">
			<p class="text-sm text-base-content/80">
				Are you sure you would like to delete your listing?
			</p>
			<p class="text-sm text-base-content/80">
				Your listing will be permanently deleted and cannot be recovered.
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
