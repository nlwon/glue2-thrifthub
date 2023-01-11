<script>
	import { pb } from '$lib/glue/pocketbase';
	import { onMount } from 'svelte';

	let courses = [];
	let clubs = [];
	let dorms = [];

	onMount(async () => {
		const coursesData = await pb.collection('topics').getList(1, 4, {
			filter: "category='course'",
			sort: '-pageView'
		});
		courses = coursesData?.items || [];
		const clubsData = await pb.collection('topics').getList(1, 4, {
			filter: "category='club'",
			sort: '-pageView'
		});
		clubs = clubsData?.items || [];
		const dormsData = await pb.collection('topics').getList(1, 4, {
			filter: "category='dorm'",
			sort: '-pageView'
		});
		dorms = dormsData?.items || [];
	});
</script>

<div class="space-y-6 rounded-xl bg-base-200 py-6 px-4 md:py-6">
	<div class="space-y-3">
		<p class="text-sm font-semibold uppercase">📚 Hot courses</p>
		<div class="space-y-2">
			{#each courses as course, idx (course?.id)}
				<a href={`/topic/${course?.id}`} class="block" target="_self">
					<button class="btn-block btn-sm btn block text-left">{idx + 1}. {course?.name}</button>
				</a>
			{/each}
		</div>
	</div>
	<div class="space-y-3">
		<p class="text-sm font-semibold uppercase">📚 Hot dorms</p>
		<div class="space-y-2">
			{#each dorms as dorm, idx (dorm?.id)}
				<a href={`/topic/${dorm?.id}`} class="block" target="_self">
					<button class="btn-block btn-sm btn block text-left">{idx + 1}. {dorm?.name}</button>
				</a>
			{/each}
		</div>
	</div>
	<div class="space-y-3">
		<p class="text-sm font-semibold uppercase">📚 Hot clubs</p>
		<div class="space-y-2">
			{#each clubs as club, idx (club?.id)}
				<a href={`/topic/${club?.id}`} class="block" target="_self">
					<button class="btn-block btn-sm btn block text-left"
						><p class="line-clamp-1">{idx + 1}. {club?.name}</p></button
					>
				</a>
			{/each}
		</div>
	</div>
</div>
