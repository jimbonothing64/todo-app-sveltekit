<script lang="ts">
	import type { Todo } from '$lib/types';

	export let id: number;
	export let title: string;
	export let todos: Array<Todo>;

	const handleTodoClick = (todo: (typeof todos)[number]) => {
		todo.completed = !todo.completed;
	};
</script>

<div class="flex flex-row justify-between">
	<h5 class="mb-2 text-2xl font-bold tracking-tight dark:text-white capitalize">
		{title}
	</h5>
</div>
<ul>
	{#each todos as todo (todo.id)}
		<li>
			<label>
				<input
					on:click={() => handleTodoClick(todo)}
					bind:checked={todo.completed}
					name="completed"
					class="text-green-600"
					type="checkbox"
				/>
				{todo.text}
			</label>
		</li>
	{/each}
</ul>
