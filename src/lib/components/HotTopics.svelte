<script>
	import { pb } from '$lib/glue/pocketbase';
	import IconDocs from '$lib/icons/glue/IconDocs.svelte';
	import IconHome from '$lib/icons/glue/IconHome.svelte';
	import IconRugbyBall from '$lib/icons/glue/IconRugbyBall.svelte';
	import { onMount } from 'svelte';

	let courses = [];
	let clubs = [];
	let dorms = [];

	onMount(async () => {
		const coursesData = await pb.collection('topics').getList(1, 4, {
			filter: "category='course'",
			sort: '-pageView',
			$autoCancel: false
		});
		courses = coursesData?.items || [];
		const clubsData = await pb.collection('topics').getList(1, 4, {
			filter: "category='club'",
			sort: '-pageView',
			$autoCancel: false
		});
		clubs = clubsData?.items || [];
		const dormsData = await pb.collection('topics').getList(1, 4, {
			filter: "category='dorm'",
			sort: '-pageView',
			$autoCancel: false
		});
		dorms = dormsData?.items || [];
	});
</script>

<div class="space-y-6 rounded-xl bg-base-200 py-6 px-4 md:py-6">
	<div class="space-y-3">
		<div class="flex items-center space-x-2">
			<IconDocs />
			<p class="text-sm font-semibold uppercase">Hot courses</p>
		</div>
		<div class="space-y-2">
			{#each courses as course, idx (course?.id)}
				<a href={`/topic/${course?.id}`} class="block" target="_self">
					<button class="btn-outline btn-block btn-sm btn block text-left opacity-90"
						>{idx + 1}. {course?.name}</button
					>
				</a>
			{/each}
		</div>
	</div>
	<div class="space-y-3">
		<div class="flex items-center space-x-2">
			<IconHome />
			<p class="text-sm font-semibold uppercase">Hot dorms</p>
		</div>
		<div class="space-y-2">
			{#each dorms as dorm, idx (dorm?.id)}
				<a href={`/topic/${dorm?.id}`} class="block" target="_self">
					<button class="btn-outline btn-block btn-sm btn block text-left opacity-90"
						>{idx + 1}. {dorm?.name}</button
					>
				</a>
			{/each}
		</div>
	</div>
	<div class="space-y-3">
		<div class="flex items-center space-x-2">
			<IconRugbyBall />
			<p class="text-sm font-semibold uppercase">Hot clubs</p>
		</div>
		<div class="space-y-2">
			{#each clubs as club, idx (club?.id)}
				<a href={`/topic/${club?.id}`} class="block" target="_self">
					<button class="btn-outline btn-block btn-sm btn block text-left opacity-90"
						><p class="line-clamp-1">{idx + 1}. {club?.name}</p></button
					>
				</a>
			{/each}
		</div>
	</div>
</div>
