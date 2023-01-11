<script>
	import { onMount } from 'svelte';
	import axios from 'axios';
	import { pb } from '$lib/glue/pocketbase';
	import { differenceInDays, format, formatDistance } from 'date-fns';
	import IconUpArrow from '$lib/icons/glue/IconUpArrow.svelte';
	import showdown from 'showdown';

	export let topic;

	let questionThreads = [];

	const scrapeQAFromReddit = async () => {
		const { data } = await axios(
			`https://www.reddit.com/r/Cornell/search/.json?q=${encodeURIComponent(
				topic?.name
			)}&limit=30&restrict_sr=1&sr_nsfw=`
		);

		const promises = data?.data?.children?.map(async ({ data }) => {
			const { selftext, title, permalink } = data;

			if (
				(selftext?.includes(topic?.name) || title?.includes(topic?.name)) &&
				(selftext?.includes('?') || title?.includes('?'))
			) {
				const { data: postData } = await axios.get(`https://www.reddit.com${permalink}.json`);

				const questionRawData = postData[0]?.data?.children[0]?.data;
				const { id, selftext, created_utc, media_metadata } = questionRawData;

				if (media_metadata || title?.includes('[deleted]') || selftext?.includes('[deleted]'))
					return null;

				// NOTE: because a question can be for multiple topics
				const providerId = `${topic?.id}-${id}`;

				const questionData = {
					title,
					content: selftext,
					provider: 'reddit',
					providerId,
					providerData: questionRawData,
					providerUrl: `https://www.reddit.com${permalink}`,
					topic: topic?.id,
					providerCreated: new Date(created_utc * 1000)
				};

				let question;

				try {
					question = await pb
						.collection('questions')
						.getFirstListItem(`providerId='${providerId}'`, { $autoCancel: false });
					question = await pb
						.collection('questions')
						.update(question?.id, questionData, { $autoCancel: false });
				} catch (error) {
					question = await pb.collection('questions').create(questionData, { $autoCancel: false });
				}
				question.answers = [];

				if (postData?.length >= 2) {
					const comments = postData[1]?.data?.children;

					for (let i = 0; i < comments?.length; i++) {
						const commentDataRaw = comments[i]?.data;
						const { body, id, permalink, score, created_utc } = commentDataRaw;
						const providerId = `${topic?.id}-${id}`;

						if (body?.includes('[deleted]')) return null;

						if (score >= 1) {
							const answerData = {
								content: body,
								provider: 'reddit',
								providerId,
								providerData: commentDataRaw,
								providerUrl: `https://www.reddit.com${permalink}`,
								helpfulCount: score,
								topic: topic?.id,
								question: question?.id,
								providerCreated: new Date(created_utc * 1000)
							};

							let answer;

							try {
								answer = await pb
									.collection('answers')
									.getFirstListItem(`providerId='${providerId}'`, { $autoCancel: false });
								answer = await pb
									.collection('answers')
									.update(answer?.id, answerData, { $autoCancel: false });
							} catch (error) {
								answer = await pb.collection('answers').create(answerData, { $autoCancel: false });
							}
							question?.answers?.push(answer);
						}
					}
				}

				return question;
			}
		});

		const scrapedQuestionThreads = await Promise.all(promises);
		const existingQuestionIds = questionThreads?.map((question) => question?.id);
		const newQuestionThreads = scrapedQuestionThreads?.filter(
			(question) => question && !existingQuestionIds?.includes(question?.id)
		);
		questionThreads = [...questionThreads, ...newQuestionThreads];
	};

	const fetchQAFromDB = async () => {
		const questions = await pb.collection('questions').getFullList(200, {
			filter: `topic='${topic?.id}'`,
			sort: '-created'
		});
		const promises = questions?.map(async (question) => {
			const answers = await pb.collection('answers').getFullList(200, {
				filter: `question='${question?.id}'`,
				$autoCancel: false
			});
			return {
				...question,
				answers
			};
		});
		questionThreads = await Promise.all(promises);
	};

	onMount(() => {
		fetchQAFromDB();
		scrapeQAFromReddit();
	});
	$: console.log('questionThreads', questionThreads);

	const converter = new showdown.Converter();
	converter?.setOption('openLinksInNewWindow', true);

	const formatDate = (obj) => {
		const date = obj?.providerCreated || obj?.created;
		if (!date) return '';

		if (differenceInDays(new Date(), new Date(date)) > 7) {
			return format(new Date(date), 'yyyy-MM-dd hh:mm aaa');
		} else {
			return `${formatDistance(new Date(), new Date(date))} ago`;
		}
	};
</script>

<div class="">
	<p class="text-3xl font-semibold">Discussions ({questionThreads?.length})</p>
	<div class="">
		{#each questionThreads as question (question?.id)}
			<div class="space-y-4 border-b border-base-300 py-8">
				<p class="text-xl font-semibold">Q. {question?.title}</p>
				<article class="prose prose-a:text-blue-600">
					{@html converter.makeHtml(question?.content)}
				</article>
				<p class="mt-0.5 text-sm text-base-content/80">
					{formatDate(question)}
				</p>
				{#if question?.answers?.length > 0}
					<div class="space-y-6 pt-2">
						{#each question?.answers as answer (answer?.id)}
							<div class="space-y-3 border-l-2 border-primary/80 pl-5">
								<article class="prose prose-a:text-blue-600">
									{@html converter.makeHtml(answer?.content)}
								</article>
								<div class="flex items-center space-x-2">
									<button class="btn-base btn-xs btn gap-2 rounded-full"
										><IconUpArrow /> {answer?.helpfulCount} Helpful</button
									>
									<p class="mt-0.5 text-sm text-base-content/80">
										{formatDate(answer)}
									</p>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>
