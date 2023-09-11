<script lang="ts">
	import type { Todo, TodoList } from '$lib/types';
	import TodoItem from '$lib/components/todo-list/TodoItem.svelte';
	export let showTitle = true;
	export let todos: Array<Todo> = [];
	let newTodo: Todo = {
		id: null,
		ordering: todos.length,
		text: '',
		completed: false
	};

	const handleAddTodo = (event: KeyboardEvent) => {
		if (event.key === 'Enter') {
			if (newTodo.text !== '') {
				todos = [...todos, newTodo];
				newTodo = {
					id: null,
					ordering: todos.length,
					text: '',
					completed: false
				};
				event.preventDefault(); // Add new todo, without form submit.
			}
			// Form submit.
		}
	};
</script>

{#if showTitle}
	<input
		name="title"
		type="text"
		autocomplete="off"
		placeholder="Title"
		class="pt-4 px-4 focus:outline-none text-2xl rounded-3xl font-bold tracking-tight"
	/>
{/if}
<ul class="p-4">
	{#each todos as todo}
		<li><TodoItem {...todo} /></li>
	{/each}
	<li>
		<input
			bind:value={newTodo.completed}
			name="todo.{newTodo.ordering}.completed"
			class="text-green-600"
			type="checkbox"
		/>
		<input
			bind:value={newTodo.text}
			on:keydown|capture={handleAddTodo}
			name="text"
			type="text"
			autocomplete="off"
			placeholder="Todo item..."
			class=" px-1 focus:outline-none rounded-3xl"
		/>
	</li>
</ul>
