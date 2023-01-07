<script lang="ts">
	import { DateInput } from 'date-picker-svelte';
	import type { ComponentProps } from 'svelte';
	import { add, set } from 'date-fns';

	interface $$Props extends ComponentProps<DateInput> {
		label?: string;
	}

	export let label: string = '';
	export let value: Date | null | undefined = null;
</script>

<div class="form-control w-full max-w-[14rem]">
	<label class="label">
		<span class="label-text">{label}</span>
	</label>
	<DateInput
		bind:value
		format="yyyy-MM-dd"
		closeOnSelection={true}
		placeholder="Select date"
		min={set(new Date(), {
			date: 1
		})}
		max={add(new Date(), {
			years: 1
		})}
		{...$$restProps}
	/>
</div>

<style>
	:root {
		--date-picker-background: hsl(var(--b1));
		--date-picker-foreground: hsl(var(--bc));
		--date-picker-selected-color: hsl(var(--nc));
		--date-picker-selected-background: hsl(var(--p));
		--date-picker-highlight-border: hsl(var(--p));
		--date-picker-highlight-shadow: hsl(var(--p));
	}

	.form-control :global(.date-time-field input) {
		padding-left: 1rem;
		padding-right: 1rem;
		height: 3rem;
		border-radius: var(--rounded-btn, 0.5rem);
		width: 100%;
	}
</style>
