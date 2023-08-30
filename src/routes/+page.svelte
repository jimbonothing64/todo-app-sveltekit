<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	$: todoLists = data.allTodoLists;
	console.log(data.allTodoLists);
</script>

<ul>
	{#each todoLists as todoList}
		<li>
			{todoList.title}
			<ul>
				{#each todoList.todos as todo}
					<li>{todo.text}</li>
				{/each}
			</ul>
		</li>
	{/each}
</ul>
