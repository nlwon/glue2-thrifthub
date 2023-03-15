import IconMessage from '$lib/icons/glue/IconMessage.svelte';
import type { IPublicNav, IPrivateNav } from '$lib/types/glue/nav.type';

export const APP_NAME = 'ThriftHub';
export const PUBLIC_NAVS: IPublicNav[] = [];
export const PRIVATE_NAVS: IPrivateNav[] = [
	{
		label: 'Messages',
		path: '/chatrooms',
		icon: IconMessage
	}
];
export const IS_GOOGLE_AUTH_ONLY = true;
export const IS_ENFORCE_CORNELL_EMAIL = true;
export const IS_BETA = true;
export const SENTRY_DSN_PUBLIC = '';
