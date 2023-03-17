import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	return {
		listingId: params?.listingId
	};
};
