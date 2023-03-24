import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import type { Page } from '@sveltejs/kit';

interface IUpdateQuery {
	key: string;
	value: string | null;
	$page: Page;
}

export const updateQuery = ({ key = 'query', value = null, $page }: IUpdateQuery) => {
	if (browser) {
		const newSearchParams = new URLSearchParams($page?.url?.searchParams);
		if (value && value?.length > 0) {
			newSearchParams?.set(key, value);
			goto(`?${newSearchParams.toString()}`, {
				keepFocus: true
			});
		} else {
			newSearchParams?.delete(key);
			goto(`?${newSearchParams.toString()}`, {
				keepFocus: true
			});
		}
	}
};

export const updatQueryByObject = ($page, obj) => {
	if (browser) {
		const newSearchParams = new URLSearchParams($page?.url?.searchParams);
		Object.entries(obj).map(([key, value]) => {
			if (value && value?.length > 0) {
				newSearchParams?.set(key, value);
			} else {
				newSearchParams?.delete(key);
			}
		});
		goto(`?${newSearchParams.toString()}`, {
			keepFocus: true
		});
	}
};

export default updateQuery;
