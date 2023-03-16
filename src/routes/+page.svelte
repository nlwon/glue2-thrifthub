<script lang="ts">
	import Aside from '$lib/components/glue/Aside.svelte';
	import Main from '$lib/components/glue/Main.svelte';
	import PageContainer from '$lib/components/glue/PageContainer.svelte';
</script>

<PageContainer title="Home" layout="aside-main">
	
	<Aside>
		<h1>Filters</h1>
		<div>
			<input type="checkbox" id="clothing" name="clothing" value="Clothing">
			<label for="clothing">Clothing</label><br>

			<input type="checkbox" id="decoration" name="decoration" value="Decoration">
			<label for="decoration">Decoration</label><br>

			<input type="checkbox" id="furniture" name="furniture" value="Furniture">
			<label for="furniture">Furniture</label><br><br>

			<input type="checkbox" id="electronics" name="electronics" value="Electronics">
			<label for="electronics">Electronics</label><br><br>

			<input type="checkbox" id="supplies" name="supplies" value="Supplies">
			<label for="supplies">Supplies</label><br><br>
			
		</div>


		<!-- <input type="checkbox" checked="checked" class="checkbox" />
		<label for="my-modal" class="btn">open modal</label> -->
	</Aside>
	<Main>main</Main>
</PageContainer>
