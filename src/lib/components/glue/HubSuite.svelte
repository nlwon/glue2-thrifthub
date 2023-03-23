<script>
	import IconHubSuite from '$lib/icons/glue/IconHubSuite.svelte';
	import { isMd } from '$lib/stores/glue/device';

	$: size = $isMd ? 30 : 24;

	const products = [
		{
			name: 'Sublet',
			desc: 'Find and list student sublets!',
			stats: '12,000 users • 3,000 sublets',
			gradient: 'scarlet',
			url: 'https://cornlet.hubcornell.com'
		},
		{
			name: 'Opinion',
			desc: 'Synthesized course reviews!',
			stats: '7,100 courses • 2,000 reviews',
			gradient: 'midnight',
			url: 'https://opinion.hubcornell.com',
			stage: 'beta'
		},
		{
			name: 'Ride',
			desc: 'Carpooling for school breaks!',
			gradient: 'pumpkin',
			url: 'https://ride.hubcornell.com',
			stage: 'beta'
		},
		{
			name: 'Thrift',
			desc: 'Item and clothing reselling!',
			gradient: 'shamrock',
			url: 'https://thrift.hubcornell.com/',
			stage: 'beta'
		},
		{
			name: 'Refer',
			desc: 'Application referrals by alumni!',
			gradient: 'daybreak',
			url: 'https://refer.hubcornell.com/',
			stage: 'coming-soon'
		},
		{
			name: 'Find',
			desc: 'Crowdsourced lost-and-found!',
			gradient: 'cerulean',
			url: 'https://find.hubcornell.com/',
			stage: 'coming-soon'
		}
	];
</script>

<div class="dropdown-end dropdown">
	<div class="flex items-center">
		<style>
			.padding-adjust {
				padding-left: 0.6rem;
    			padding-right: 0.6rem;
			}
		</style>
		<label tabindex="0" class="btn-ghost btn-sm btn bg-base-content/10 px-2 md:btn-md padding-adjust">
			<IconHubSuite width={size} height={size} />
		</label>
	</div>

	<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
	<ul tabindex="0" style="right: -5.8pc; width: 15rem;" class="dropdown-content menu rounded-box menu-compact mt-3 w-64 translate-x-24 bg-base-200 p-2 shadow drop-shadow-xl right-shift">
		{#each products as product}
			<li class="my-1">
				<a
					class="bg-base-100 hover:bg-base-100/50"
					href={product?.stage === 'coming-soon' ? undefined : product?.url}
					target="_blank"
					rel="noopener noreferrer"
				>
					<div>
						<div class="flex items-center">
							<p class="text-sm font-semibold">
								<span class="{product?.gradient} mr-0.5">{product?.name}</span>Hub
							</p>

							{#if product?.stage === 'beta'}
								<p class="ml-1 text-sm font-semibold text-base-content/50">beta</p>
							{/if}
						</div>

						<p class="mt-1 text-xs font-medium text-base-content/80">{product?.desc}</p>

						{#if product?.stats}
							<p class="text-xs text-base-content/60">{product?.stats}</p>
						{/if}

						{#if product?.stage === 'coming-soon'}
							<div style="background-color: #737b87; border-color: #737b87;" class="rounded-xs badge-primary badge badge-sm ml-[-0.25rem] mt-2 color-shift">
								Coming Soon
							</div>
						{/if}
					</div>
				</a>
			</li>
		{/each}
	</ul>
</div>

<style>
	.scarlet {
		background: linear-gradient(100.4deg, #b64468 5.49%, #ff5858 141.74%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		color: transparent;
	}

	.midnight {
		background: linear-gradient(100.4deg, #8279f1 5.49%, #da6767 141.74%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		color: transparent;
	}

	.pumpkin {
		background: linear-gradient(100.4deg, #fd8935 5.49%, #d9378e 141.74%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		color: transparent;
	}

	.shamrock {
		background: linear-gradient(100.4deg, #12aa58 5.49%, #ffcb45 141.74%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		color: transparent;
	}

	.daybreak {
		background: linear-gradient(100.4deg, #dcae38 5.49%, #dd4ca3 141.74%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		color: transparent;
	}

	.cerulean {
		background: linear-gradient(100.4deg, #2496ff 5.49%, #a584d0 141.74%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		color: transparent;
	}
</style>