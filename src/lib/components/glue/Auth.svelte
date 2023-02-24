<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { APP_NAME, IS_ENFORCE_CORNELL_EMAIL, IS_GOOGLE_AUTH_ONLY } from '$lib/glue/config';
	import { currentUser, pb } from '$lib/glue/pocketbase';
	import IconGoogle from '$lib/icons/glue/IconGoogle.svelte';
	import IconLogout from '$lib/icons/glue/IconLogout.svelte';
	import IconMessage from '$lib/icons/glue/IconMessage.svelte';
	import { onMount } from 'svelte';

	const PRIVATE_NAVS = [
		{
			label: 'Messages',
			path: '/chatrooms',
			icon: IconMessage
		}
	];

	let state: 'signin' | 'register' = 'register';

	const toggleState = () => {
		if (state === 'signin') state = 'register';
		else state = 'signin';
	};

	let authProviders = {};
	let redirectUrl = '';
	let isForceCornellModalOpen = false;

	onMount(async () => {
		if (window?.location?.pathname !== '/redirect') {
			localStorage.setItem('returnUrl', window?.location?.href);
		}

		const authMethods = await pb.collection('users').listAuthMethods();

		if (authMethods) {
			redirectUrl = `${window.location.origin}/redirect`;

			authMethods?.authProviders?.forEach((provider) => {
				authProviders[provider?.name] = provider;
			});

			const params = new URL(window.location as string).searchParams;
			const authCode = params.get('code');
			const provider =
				localStorage.getItem('provider') && localStorage.getItem('provider') !== 'undefined'
					? JSON.parse(localStorage.getItem('provider') || '')
					: null;

			if (authCode && provider.state === params.get('state')) {
				const authResult = await pb
					.collection('users')
					.authWithOAuth2('google', authCode, provider.codeVerifier, redirectUrl);

				pb.collection('users').update(authResult?.record?.id, {
					name: authResult?.meta?.rawUser?.name,
					avatarUrl: authResult?.meta?.rawUser?.picture
				});

				const isCornell = authResult?.meta?.rawUser?.email?.split('@')[1] === 'cornell.edu';

				if (IS_ENFORCE_CORNELL_EMAIL && !isCornell) {
					signOut();
					isForceCornellModalOpen = true;
				}
			}

			$page.url.searchParams.delete('code');
			$page.url.searchParams.delete('state');
			$page.url.searchParams.delete('scope');
			$page.url.searchParams.delete('authuser');
			$page.url.searchParams.delete('hd');
			$page.url.searchParams.delete('prompt');

			let returnUrl = localStorage.getItem('returnUrl') || `?${$page.url.searchParams.toString()}`;
			goto(returnUrl);
		}
	});

	const signInGoogle = async () => {
		localStorage.setItem('provider', JSON.stringify(authProviders?.google));

		const url = authProviders?.google?.authUrl + redirectUrl;
		goto(url);
	};

	let email: string;
	let password: string;
	let username: string;

	async function login() {
		await pb.collection('users').authWithPassword(email, password);
	}

	async function signUp() {
		try {
			const data = {
				email,
				password,
				passwordConfirm: password,
				name: username
			};
			await pb.collection('users').create(data);
			await login();
		} catch (err) {
			console.error(err);
		}
	}

	function signOut() {
		pb.authStore.clear();
	}

	const handleSubmit = () => {
		if (state === 'signin') login();
		else if (state === 'register') signUp();
	};
</script>

<!-- modal: force cornell auth -->
<div class={`modal ${isForceCornellModalOpen && 'modal-open'}`} id="modal-force-cornell">
	<div class="modal-box w-11/12 max-w-sm">
		<h3 class="text-lg font-bold">Sign in with a @cornell.edu account</h3>
		<p class="py-4">
			You must sign in with a <span class="underline decoration-primary underline-offset-2"
				>Cornell email</span
			>
			to use {APP_NAME}.
		</p>
		<div class="flex justify-end space-x-2">
			<button
				class="btn-ghost btn"
				on:click={() => {
					isForceCornellModalOpen = false;
				}}>Close</button
			>
			<button type="button" class="btn-primary btn" on:click={signInGoogle}>Sign in again</button>
		</div>
	</div>
</div>

{#if $currentUser}
	<div class="dropdown-end dropdown">
		<label tabindex="0" class="btn-ghost btn-square btn">
			<div class="placeholder avatar">
				<div
					class="w-8 rounded-full bg-neutral-focus text-neutral-content ring-2 ring ring-primary ring-offset-2 ring-offset-base-100"
				>
					{#if $currentUser?.avatarUrl}
						<img src={$currentUser?.avatarUrl} />
					{:else}
						<span class="text-sm">{$currentUser?.name?.charAt(0)}</span>
					{/if}
				</div>
			</div>
		</label>
		<ul
			tabindex="0"
			class="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-200 p-2 shadow"
		>
			{#each PRIVATE_NAVS as nav}
				<li>
					<a href={nav.path}>
						<svelte:component this={nav.icon} />{nav.label}
					</a>
				</li>
			{/each}
			<li><button on:click={signOut}><IconLogout />Logout</button></li>
		</ul>
	</div>
{:else}
	<button>
		<label for="modal-auth" class="btn-primary btn">Get started</label>
	</button>
	<input type="checkbox" id="modal-auth" class="modal-toggle" />
	<label for="modal-auth" class="modal cursor-pointer">
		<label class="modal-box relative w-11/12 max-w-sm" for="">
			<form on:submit|preventDefault={handleSubmit}>
				<div class="flex flex-col gap-3">
					{#if IS_GOOGLE_AUTH_ONLY}
						<h3 class="mb-2 p-0 text-xl font-medium text-gray-900 dark:text-white">
							Sign in
							{#if IS_ENFORCE_CORNELL_EMAIL}
								<span
									>with your <span class="underline decoration-primary underline-offset-2"
										>Cornell email</span
									></span
								>
							{:else}
								<span>to {APP_NAME}</span>
							{/if}
						</h3>
						<p class="mb-2">
							Access all of the features by signing in and getting started with {APP_NAME}.
						</p>
						{#if IS_ENFORCE_CORNELL_EMAIL}
							<p class="mb-2">
								You must sign in with your <span
									class="underline decoration-primary underline-offset-2">Cornell email</span
								>
								to sign into {APP_NAME}!
							</p>
						{/if}
						<button type="button" class="btn-primary btn gap-2" on:click={signInGoogle}
							><IconGoogle /> Sign in with {IS_ENFORCE_CORNELL_EMAIL
								? 'Cornell email'
								: 'Google'}</button
						>
					{:else}
						<h3 class="p-0 text-xl font-medium text-gray-900 dark:text-white">
							{state === 'signin' ? 'Sign in to' : 'Create an account on'}
							{APP_NAME}
						</h3>
						{#if state === 'register'}
							<div class="form-control">
								<label class="label" for="username">Name</label>
								<input
									class="input-bordered input w-full max-w-xs"
									name="username"
									placeholder="John Doe"
									required
									bind:value={username}
								/>
							</div>
						{/if}
						<div class="form-control">
							<label class="label" for="email">Email</label>
							<input
								class="input-bordered input w-full max-w-xs"
								type="email"
								name="email"
								placeholder="name@company.com"
								required
								bind:value={email}
							/>
						</div>
						<div class="form-control">
							<label class="label" for="password">Password</label>
							<input
								class="input-bordered input w-full max-w-xs"
								type="password"
								name="password"
								placeholder="••••••••••"
								required
								bind:value={password}
							/>
						</div>
						<div class="flex items-center justify-between">
							<!-- NOTE: remember me checkbox -->
							<!-- <div class="form-control">
							<label class="label cursor-pointer">
								<div class="flex items-center gap-3">
									<input type="checkbox" checked={true} class="checkbox-primary checkbox" />
									<span class="label-text">Remember me</span>
								</div>
							</label>
						</div> -->
							{#if state === 'signin'}
								<div>
									<a
										href="/"
										class="ml-auto text-sm text-blue-700 hover:underline dark:text-blue-500"
										>Lost password?</a
									>
								</div>
							{/if}
						</div>
						<button type="submit" class="btn-primary btn-block btn"
							>{state === 'signin' ? 'Sign in' : 'Create account'}</button
						>
						<div class="text-sm font-medium text-gray-500 dark:text-gray-300">
							{state === 'signin' ? 'Not registered?' : 'Already have an account?'}
							<button
								class="text-blue-700 hover:underline dark:text-blue-500"
								on:click={toggleState}
								type="button"
								>{state === 'signin' ? 'Create account' : 'Sign in'}
							</button>
						</div>
					{/if}
				</div>
				<!-- <input placeholder="Username" type="text" bind:value={email} />
				<input placeholder="Password" type="password" bind:value={password} />
				<div class="mt-2 flex items-center gap-2">
					<button class="btn-sm btn" on:click={signUp}>Sign Up</button>
					<button class="btn-sm btn" on:click={login}>Login</button>
				</div> -->
			</form>
		</label>
	</label>
{/if}
