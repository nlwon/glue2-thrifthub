<script>
	import { PRIVATE_NAVS } from '$lib/glue/config';
	import IconLogout from '$lib/icons/glue/IconLogout.svelte';
</script>

<div class="hidden md:block">
	<p class="ml-6 text-xl font-semibold">My ThriftHub</p>
	<ul class="menu rounded-box menu-compact w-56 bg-base-100 p-2">
		{#each PRIVATE_NAVS as nav}
			<li>
				<a href={nav.path}>
					<svelte:component this={nav.icon} />{nav.label}
				</a>
			</li>
		{/each}
		<li><a href="/logout"><IconLogout />Logout</a></li>
	</ul>
</div>
