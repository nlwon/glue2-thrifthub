import PocketBase from 'pocketbase';

import { writable } from 'svelte/store';

export const pb = new PocketBase('pocketbase url');
export const currentUser = writable(pb.authStore.model);

pb.autoCancellation(false);

pb.authStore.onChange((auth) => {
	currentUser.set(pb.authStore.model);
});
