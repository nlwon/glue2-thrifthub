import { dev } from '$app/environment';
import { SENTRY_DSN_PUBLIC } from '$lib/glue/config';
import * as SentryNode from '@sentry/node';
import '@sentry/tracing';
import type { HandleServerError } from '@sveltejs/kit';

SentryNode.init({
	dsn: SENTRY_DSN_PUBLIC,
	tracesSampleRate: 1.0,
	environment: dev ? 'development' : 'production',
	// Add the Http integration for tracing
	integrations: [new SentryNode.Integrations.Http()]
});

SentryNode.setTag('svelteKit', 'server');

// use handleError to report errors during server-side data loading
export const handleError = (({ error, event }) => {
	SentryNode.captureException(error, { contexts: { sveltekit: { event } } });

	return {
		message: error?.message
	};
}) satisfies HandleServerError;
