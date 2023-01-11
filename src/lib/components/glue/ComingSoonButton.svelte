<script lang="ts">
	import { pb } from '$lib/glue/pocketbase';

	export let variant: string;

	const handleClick = () => {
		pb.collection('logs').create({
			variant
		});
	};
</script>

<label for={variant} class="btn-primary btn gap-2" on:click={handleClick}><slot /></label>

<input type="checkbox" id={variant} class="modal-toggle" />
<label for={variant} class="modal cursor-pointer">
	<label class="modal-box relative" for="">
		<div class="prose">
			<h2>Coming soon 🎉</h2>
			<p>This feature is currently under development.</p>
			<p>
				Your interaction has been recorded, and will help us decide which features to proritise.
			</p>
		</div>
	</label>
</label>
