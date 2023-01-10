import { pb } from '$lib/glue/pocketbase';

const mutateCollection = async () => {
	console.log('mutateCollection script started');

	const COLLECTION_NAME = 'topics';
	let totalPages = 1;
	const pages = [];

	for (let page = 1; page <= totalPages; page++) {
		const collection = await pb.collection(COLLECTION_NAME).getList(page, 200, {
			filter: "category!='course'"
		});
		totalPages = collection?.totalPages;
		pages.push(collection?.items);
	}
	console.log('pages', pages);

	const failures = [];

	const promises = pages?.map(async (docs, idx) => {
		for (let i = 0; i < docs?.length; i++) {
			const doc = docs[i];

			try {
				const updatedDoc = await pb.collection(COLLECTION_NAME).update(doc?.id, {
					category: 'course'
				});
				console.log(idx, Math.floor((i / docs?.length) * 100), '% completed', updatedDoc?.id);
			} catch (error) {
				failures.push(doc);
			}
		}
	});

	await Promise.all(promises);

	console.log('failures', failures);
};

export default mutateCollection;
