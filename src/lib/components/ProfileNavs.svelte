<script>
	import { PRIVATE_NAVS } from '$lib/glue/config';
	import IconLogout from '$lib/icons/glue/IconLogout.svelte';
</script>

<div class="hidden md:block">
	<style>
		.left-adjust {
			margin-left: 0;
		}
		.list-head, .list-head a {
			padding-left: 0;
		}
	</style>
	<p class="ml-6 text-2xl font-semibold left-adjust">My ThriftHub</p>
	<ul class="menu rounded-box menu-compact w-56 bg-base-100 p-2 list-head">
		{#each PRIVATE_NAVS as nav}
			<li>
				<a href={nav.path}>
					<svelte:component this={nav.icon} />{nav.label}
				</a>
			</li>
		{/each}
		<li><a href="/logout"><IconLogout />Log Out</a></li>
	</ul>
</div>
