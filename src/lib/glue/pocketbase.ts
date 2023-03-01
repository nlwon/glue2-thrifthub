import PocketBase from 'pocketbase';

import { writable } from 'svelte/store';

export const pb = new PocketBase('https://glue2-thrifthub.fly.dev/');
export const currentUser = writable(pb.authStore.model);

pb.autoCancellation(false);

pb.authStore.onChange((auth) => {
	currentUser.set(pb.authStore.model);
});
