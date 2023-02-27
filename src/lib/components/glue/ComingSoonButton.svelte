<script lang="ts">
	import { pb } from '$lib/glue/pocketbase';

	export let variant: string;
	export let context = {};
	export let infoParagraphs = [
		'This feature is currently under development.',
		'Your interaction has been recorded, and will help us decide which features to proritize.'
	];

	const handleClick = () => {
		try {
			pb.collection('logs').create({
				variant,
				context
			});
		} catch (error) {}
	};
</script>

<label for={variant} class={`${$$props.class} btn gap-2`} on:click={handleClick}><slot /></label>

<input type="checkbox" id={variant} class="modal-toggle" />
<label for={variant} class="modal cursor-pointer">
	<label class="modal-box relative" for="">
		<div class="prose">
			<h2>Coming soon 🎉</h2>
			{#each infoParagraphs as paragraph}
				<p>{paragraph}</p>
			{/each}
		</div>
	</label>
</label>
