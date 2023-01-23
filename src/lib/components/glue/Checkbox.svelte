<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	interface $$Props extends HTMLInputAttributes {
		label?: string;
		name?: string;
	}
	export let label: string = '';
	export let name: string = '';
	export let checked: boolean | null | undefined = null;
</script>

<div class="form-control w-full">
	<label class="label cursor-pointer justify-start space-x-3">
		<input
			bind:checked
			on:blur
			on:change
			on:click
			on:input
			on:contextmenu
			on:focus
			on:keydown
			on:keypress
			on:keyup
			on:mouseenter
			on:mouseleave
			on:mouseover
			on:paste
			type="checkbox"
			{...$$restProps}
			{name}
			class={`${$$props.class} checkbox`}
		/>
		{#if label}
			<span class="label-text">{label}</span>
		{/if}
	</label>
</div>
