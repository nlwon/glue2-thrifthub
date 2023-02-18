<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	interface $$Props extends HTMLInputAttributes {
		label?: string;
		name?: string;
		error?: string;
	}
	export let label: string = '';
	export let name: string = '';
	export let value: string = '';
	export let error: string = '';
</script>

<div class="form-control w-full">
	{#if label}
		<label class="label">
			<span class="label-text">{label}</span>
		</label>
	{/if}
	<input
		bind:value
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
		type="text"
		{...$$restProps}
		{name}
		class={`${$$props.class} input-bordered input w-full ${error && 'input-error'}`}
	/>
	{#if error}
		<label class="label">
			<span class="label-text-alt text-error">{error}</span>
		</label>
	{/if}
</div>
