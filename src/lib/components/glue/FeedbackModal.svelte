<script>
	import { page } from '$app/stores';
	import { APP_NAME } from '$lib/glue/config';
	import { currentUser, pb } from '$lib/glue/pocketbase';
	import IconHappyFace from '$lib/icons/glue/IconHappyFace.svelte';
	import IconNeutralFace from '$lib/icons/glue/IconNeutralFace.svelte';
	import IconSadFace from '$lib/icons/glue/IconSadFace.svelte';
	import Textarea from './Textarea.svelte';

	let isOpen = false;
	let feedbackText = '';
	let feedbackId = '';
	const hideRouteIds = ['/chatrooms/[chatroomId]', '/create', '/edit/[listingId]'];
	let selected = '';

	const handleIconClick = async (review) => {
		try {
			selected = review;

			if (!feedbackId) {
				const feedback = await pb.collection('logs').create({
					variant: 'feedback',
					value: review
				});
				feedbackId = feedback?.id;
			} else {
				pb.collection('logs').update(feedbackId, {
					value: review
				});
			}
		} catch (error) {}
	};

	const handleSubmitFeedbackText = () => {
		isOpen = false;
		try {
			pb.collection('logs').update(feedbackId, {
				context: {
					feedbackText,
					currentUser: $currentUser
				}
			});
		} catch (error) {}
	};
</script>

{#if !hideRouteIds?.includes($page.route?.id)}
	<div class="fixed bottom-8 flex justify-center horiz-adjust vert-adjust">
		<div class="flex w-full pr-4 md:pr-0 shadow hidefeedback">
			<div class="">
				<label for="modal-feedback" class="btn-primary btn">Thoughts on {APP_NAME}?</label>
			</div>
		</div>
	</div>
{/if}
<input type="checkbox" id="modal-feedback" class="modal-toggle" />
<label for="modal-feedback" class="modal cursor-pointer">
	<label class="modal-box relative box-border max-h-[70vh]" for="">
		<div class="">
			<h2 class="text-2xl font-semibold">How was your experience with {APP_NAME}?</h2>
			<div class="mt-4 flex items-center justify-center space-x-1 md:space-x-6">
				<button
					class="rounded-xl bg-base-200 p-4 text-6xl text-error {selected === 'bad' &&
						'bg-red-100'}"
					on:click={() => handleIconClick('bad')}
				>
					<IconSadFace />
				</button>
				<button
					class="rounded-xl bg-base-200 p-4 text-6xl text-yellow-500 {selected === 'mid' &&
						'bg-yellow-100'}"
					type="button"
					on:click={() => handleIconClick('mid')}
				>
					<IconNeutralFace />
				</button>
				<button
					class="rounded-xl bg-base-200 p-4 text-6xl text-success  {selected === 'good' &&
						'bg-green-100'}"
					on:click={() => handleIconClick('good')}
				>
					<IconHappyFace />
				</button>
			</div>
		</div>
		{#if feedbackId}
			<div class="mt-6">
				<div class="flex items-start justify-between">
					<h2 class="m-0 font-bold">Why did you feel that way?</h2>
				</div>
				<Textarea class="h-40" bind:value={feedbackText} />
				<div class="modal-action mt-4 flex justify-center">
					<label
						for="modal-feedback"
						class="btn-primary btn-block btn"
						on:click={handleSubmitFeedbackText}>Submit</label
					>
				</div>
			</div>
		{/if}
	</label>
</label>