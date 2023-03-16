<script lang="ts">
	import Aside from '$lib/components/glue/Aside.svelte';
	import Main from '$lib/components/glue/Main.svelte';
	import PageContainer from '$lib/components/glue/PageContainer.svelte';
</script>

<PageContainer title="Home" layout="aside-main">
	
	<Aside>
		<div id="myBtnContainer">
			<button class="btn active" onclick="filterSelection('all')"> Show all</button>
			<button class="btn" onclick="filterSelection('cars')"> Cars</button>
			<button class="btn" onclick="filterSelection('animals')"> Animals</button>
			<button class="btn" onclick="filterSelection('fruits')"> Fruits</button>
			<button class="btn" onclick="filterSelection('colors')"> Colors</button>
		</div>
		<input type="checkbox" checked="checked" class="checkbox" />
		<label for="my-modal" class="btn">open modal</label>
	</Aside>
	<Main>main</Main>
</PageContainer>
