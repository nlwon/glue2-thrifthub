<script>
	export let chatroom;
</script>

{#if chatroom}
	<p>chatroom {chatroom?.id}</p>
{/if}
