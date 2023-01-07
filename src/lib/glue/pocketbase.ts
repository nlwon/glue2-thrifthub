import PocketBase from 'pocketbase';

import { writable } from 'svelte/store';

export const pb = new PocketBase('https://thrifthub.fly.dev/');
export const currentUser = writable(pb.authStore.model);

pb.authStore.onChange((auth) => {
	console.log('auth onchange', auth);
	currentUser.set(pb.authStore.model);
});
