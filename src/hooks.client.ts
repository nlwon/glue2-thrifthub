import { dev } from '$app/environment';
import { SENTRY_DSN_PUBLIC } from '$lib/glue/config';
import * as SentrySvelte from '@sentry/svelte';
import { BrowserTracing } from '@sentry/tracing';
import type { HandleClientError } from '@sveltejs/kit';

SentrySvelte.init({
	dsn: SENTRY_DSN_PUBLIC,
	integrations: [new BrowserTracing()],
	tracesSampleRate: 1.0,
	environment: dev ? 'development' : 'production'
});

SentrySvelte.setTag('svelteKit', 'browser');

// This will catch errors in `load` functions from `+page.ts` files
export const handleError = (({ error, event }) => {
	console.log('error', error);
	SentrySvelte.captureException(error, { contexts: { sveltekit: { event } } });

	return {
		message: error?.message
	};
}) satisfies HandleClientError;
