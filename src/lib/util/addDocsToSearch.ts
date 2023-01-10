import MeiliSearch from 'meilisearch';

const client = new MeiliSearch({
	host: 'https://meilisearch-production-023b.up.railway.app/',
	apiKey: 'BpNG6BkFrQBQ3aOB3ao6yRMwGHnJzbFUt9k6MDZzNJ'
});

const addDocsToSearch = async ({ indexName, docs }) => {
	client
		.index(indexName)
		.addDocuments(
			docs?.map((doc) => {
				// @ts-ignore
				delete doc.collectionId;
				// @ts-ignore
				delete doc.collectionName;
				return doc;
			})
		)
		.then((res) => console.log('res', res));
};

export default addDocsToSearch;
