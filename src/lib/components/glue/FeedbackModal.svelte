<script>
	import { page } from '$app/stores';
	import { APP_NAME } from '$lib/glue/config';
	import { pb } from '$lib/glue/pocketbase';
	import IconHappyFace from '$lib/icons/glue/IconHappyFace.svelte';
	import IconNeutralFace from '$lib/icons/glue/IconNeutralFace.svelte';
	import IconSadFace from '$lib/icons/glue/IconSadFace.svelte';
	import Textarea from './Textarea.svelte';
	import TextInput from './TextInput.svelte';

	let isOpen = false;
	let step = 1;
	let feedbackText = '';
	let feedbackId = '';
	const hideRouteIds = ['/chatrooms/[chatroomId]'];

	const handleIconClick = async (review) => {
		try {
			step = 2;
			const feedback = await pb.collection('logs').create({
				variant: 'feedback',
				value: review
			});
			feedbackId = feedback?.id;
		} catch (error) {}
	};

	const handleSubmitFeedbackText = () => {
		isOpen = false;
		try {
			pb.collection('logs').update(feedbackId, {
				context: {
					feedbackText
				}
			});
		} catch (error) {}
	};

	const handleCloseModal = () => {
		isOpen = false;
	};
</script>

{#if !hideRouteIds?.includes($page.route?.id)}
	<div class="fixed left-0 right-0 bottom-0 flex justify-center">
		<div class="flex w-full max-w-4xl justify-end pb-6 pr-4 md:pr-0">
			<div class="">
				<label
					for="modal-feedback"
					class="btn-primary btn-sm btn"
					on:click={() => {
						isOpen = true;
						step = 1;
					}}>Thoughts on {APP_NAME}?</label
				>
			</div>
		</div>
	</div>
	<input type="checkbox" id="modal-feedback" class="modal-toggle" />
	<label for="modal-feedback" class={`modal cursor-pointer ${isOpen ? 'modal-open' : ''}`}>
		<label class="modal-box relative box-border max-h-[70vh]" for="">
			{#if step === 1}
				<div class="prose">
					<h2 class="font-bold">How was your experience with {APP_NAME}?</h2>
					<div class="modal-action flex items-center justify-center space-x-1 md:space-x-6">
						<button
							class="rounded-xl p-4 text-6xl hover:bg-base-300"
							on:click={() => handleIconClick('bad')}
						>
							<IconSadFace />
						</button>
						<button
							class="rounded-xl p-4 text-6xl hover:bg-base-300"
							on:click={() => handleIconClick('mid')}
						>
							<IconNeutralFace />
						</button>
						<button
							class="rounded-xl p-4 text-6xl hover:bg-base-300"
							on:click={() => handleIconClick('good')}
						>
							<IconHappyFace />
						</button>
					</div>
				</div>
			{:else if step === 2}
				<div class="prose">
					<div class="flex items-start justify-between">
						<h2 class="m-0 font-bold">Why did you feel that way?</h2>
						<button on:click={handleCloseModal} class="btn-sm btn-circle btn">✕</button>
					</div>
					<Textarea class="h-40" bind:value={feedbackText} />
					<div class="mt-4 flex justify-center">
						<button class="btn-primary btn-block btn" on:click={handleSubmitFeedbackText}
							>Submit</button
						>
					</div>
				</div>
			{/if}
		</label>
	</label>
{/if}
