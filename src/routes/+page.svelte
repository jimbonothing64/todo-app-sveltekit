<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	$: todoLists = data.allTodoLists;
</script>

{#each todoLists as todoList}
	{todoList.title}
{/each}
