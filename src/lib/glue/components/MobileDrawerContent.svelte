<script>
	import { APP_NAME, PUBLIC_NAVS } from '$lib/glue/config';
</script>

<div class="drawer-side">
	<label for="drawer-mobile-nav" class="drawer-overlay" />
	<div class="w-80 space-y-4 bg-base-200 p-4 text-base-content">
		<button>
			<a class="btn-ghost btn text-xl normal-case">{APP_NAME}</a>
		</button>
		<ul class="menu rounded-xl bg-base-100 p-2">
			{#each PUBLIC_NAVS as nav}
				<li><a href={nav.path}>{nav.label}</a></li>
			{/each}
		</ul>
	</div>
</div>
