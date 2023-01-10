<script>
	import { onMount } from 'svelte';
	import axios from 'axios';
	import { pb } from '$lib/glue/pocketbase';
	import { format } from 'date-fns';
	import IconUpArrow from '$lib/icons/glue/IconUpArrow.svelte';
	import showdown from 'showdown';

	export let topic;

	let questionThreads = [];

	const fetchQA = async () => {
		const { data } = await axios(
			`https://www.reddit.com/r/Cornell/search/.json?q=${encodeURIComponent(
				topic?.name
			)}&limit=30&restrict_sr=1&sr_nsfw=`
		);

		data?.data?.children?.map(async ({ data }) => {
			const { selftext, title, permalink } = data;

			if (
				(selftext?.includes(topic?.name) || title?.includes(topic?.name)) &&
				(selftext?.includes('?') || title?.includes('?'))
			) {
				const { data: postData } = await axios.get(`https://www.reddit.com${permalink}.json`);

				const questionRawData = postData[0]?.data?.children[0]?.data;
				const { id, selftext, created_utc } = questionRawData;

				const questionData = {
					title,
					content: selftext,
					provider: 'reddit',
					providerId: id, //TODO: topicId-providerId
					providerData: questionRawData,
					providerUrl: `https://www.reddit.com${permalink}`,
					topic: topic?.id,
					created: new Date(created_utc * 1000)
				};

				let question;

				try {
					question = await pb
						.collection('questions')
						.getFirstListItem(`providerId='${id}'`, { $autoCancel: false });
				} catch (error) {
					question = await pb.collection('questions').create(questionData, { $autoCancel: false });
				}
				question.answers = [];

				if (postData?.length >= 2) {
					// upsert comments
					const comments = postData[1]?.data?.children;

					for (let i = 0; i < comments?.length; i++) {
						const commentDataRaw = comments[i]?.data;
						const { body, id, permalink, score } = commentDataRaw;
						console.log(question?.id, score, body);

						if (score >= 1) {
							const answerData = {
								content: body,
								provider: 'reddit',
								providerId: id, //TODO: topicId-providerId
								providerData: commentDataRaw,
								providerUrl: `https://www.reddit.com${permalink}`,
								helpfulCount: score,
								topic: topic?.id,
								question: question?.id
								// TODO: update created, updated
							};

							console.log(question?.id, answerData);

							let answer;

							try {
								answer = await pb
									.collection('answers')
									.getFirstListItem(`providerId='${id}'`, { $autoCancel: false });
							} catch (error) {
								answer = await pb.collection('answers').create(answerData, { $autoCancel: false });
							}
							question?.answers?.push(answer);
						}
					}
				}
				console.log('question', question);
				questionThreads = [...questionThreads, question];
			}
		});
	};

	onMount(fetchQA);
	console.log('questionThreads', questionThreads);

	const converter = new showdown.Converter();
	converter?.setOption('openLinksInNewWindow', true);
</script>

<div class="">
	<p class="text-3xl font-semibold">Q&A ({questionThreads?.length})</p>
	<div class="">
		{#each questionThreads as question (question?.id)}
			<div class="space-y-4 border-b border-base-300 py-8">
				<p class="text-xl font-semibold">Q. {question?.title}</p>
				<p>{question?.content}</p>
				<p class="mt-0.5 text-sm text-base-content/80">
					{format(new Date(question?.created), 'yyyy-MM-dd hh:mm aaa')}
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
										{format(new Date(answer?.created), 'yyyy-MM-dd hh:mm aaa')}
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
