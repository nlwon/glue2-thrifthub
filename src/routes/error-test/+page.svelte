<script>
	const unknownFunction = () => {
		throw new Error('test hehe');
	};
</script>

<button class="btn-primary btn" type="button" on:click={unknownFunction}> Throw error </button>
