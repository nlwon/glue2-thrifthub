import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import type { Page } from '@sveltejs/kit';

interface IUpdateQuery {
	key: string;
	value: string | null;
	$page: Page;
}

const updateQuery = ({ key = 'query', value = null, $page }: IUpdateQuery) => {
	if (browser) {
		if (value && value?.length > 0) {
			$page?.url?.searchParams?.set(key, value);
			goto(`?${$page.url.searchParams.toString()}`, {
				keepFocus: true
			});
		} else {
			$page?.url?.searchParams?.delete(key);
			goto(`?${$page.url.searchParams.toString()}`, {
				keepFocus: true
			});
		}
	}
};

export default updateQuery;
