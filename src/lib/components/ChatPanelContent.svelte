<script>
	export let chatroom;

	$: console.log('chatroom?.expand?.post', chatroom?.expand?.post);
</script>

{#if chatroom}
	<div class="flex-1">ChatPanelContent (edit me)</div>
{/if}
