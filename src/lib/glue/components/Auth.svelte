<script lang="ts">
	import { goto } from '$app/navigation';
	import { APP_NAME } from '$lib/glue/config';
	import IconAdd from '$lib/glue/icons/IconAdd.svelte';
	import IconHome from '$lib/glue/icons/IconHome.svelte';
	import IconLogout from '$lib/glue/icons/IconLogout.svelte';
	import { currentUser, pb } from '$lib/glue/pocketbase';
	import { onMount } from 'svelte';

	const PRIVATE_NAVS = [
		{
			label: 'Sell item',
			path: '/new',
			icon: IconAdd
		},
		{
			label: 'My items',
			path: '/profile/items',
			icon: IconHome
		}
	];

	let state: 'signin' | 'register' = 'register';

	const toggleState = () => {
		if (state === 'signin') state = 'register';
		else state = 'signin';
	};

	let authProviders = {};
	let redirectUrl = '';

	onMount(async () => {
		const result = await pb.collection('users').listAuthMethods();
		if (result) {
			redirectUrl = `${window.location.origin}/redirect`;

			result?.authProviders?.forEach((provider) => {
				authProviders[provider?.name] = provider;
			});

			const params = new URL(window.location as string).searchParams;
			const provider = JSON.parse(localStorage.getItem('provider') || '');

			if (params.get('code')) {
				console.log('authProviders?.google?.codeVerifier', authProviders?.google?.codeVerifier);
				console.log('params.get', params.get('code'));
				const authResult = await pb
					.collection('users')
					.authWithOAuth2('google', params.get('code'), provider.codeVerifier, redirectUrl);
				console.log('authResult', authResult);

				// pb.collection('users').update(authResult?.record?.id, {
				// 	name: authResult?.meta?.name,

				// })
			}
		}
	});
	$: console.log('authProviders', authProviders);
	$: console.log('$currentUser', $currentUser);

	const signInGoogle = async () => {
		const url = authProviders?.google?.authUrl + redirectUrl;
		localStorage.setItem('provider', JSON.stringify(authProviders?.google));
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

{#if $currentUser}
	<div class="dropdown-end dropdown">
		<label tabindex="0" class="btn-ghost btn-square btn">
			<div class="placeholder avatar">
				<div
					class="w-8 rounded-full bg-neutral-focus text-neutral-content ring-2 ring ring-primary ring-offset-2 ring-offset-base-100"
				>
					<span class="text-sm">{$currentUser?.name?.charAt(0)}</span>
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
					<h3 class="p-0 text-xl font-medium text-gray-900 dark:text-white">
						{state === 'signin' ? 'Sign in to' : 'Create an account on'}
						{APP_NAME}
					</h3>
					<button type="button" class="btn-primary btn" on:click={signInGoogle}
						>Sign in with Google</button
					>
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
								<a href="/" class="ml-auto text-sm text-blue-700 hover:underline dark:text-blue-500"
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
