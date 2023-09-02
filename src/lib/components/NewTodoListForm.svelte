<script lang="ts">
	import type { Todo, TodoList } from '$lib/types';
	import TodoItem from '$lib/components/TodoItem.svelte';
	export let showTitle = true;
	export let todoList: TodoList = {
		id: 1,
		title: 'My title',
		todos: [
			{ id: 1, text: 'hello', completed: false },
			{ id: 2, text: 'goodbye', completed: true }
		]
	};
	let newTodo: Todo = {
		id: null,
		text: '',
		completed: false
	};

	const handleAddTodo = (event: KeyboardEvent) => {
		if (event.key === 'Enter') {
			if (newTodo.text !== '') {
				todoList.todos = [...todoList.todos, newTodo];
				newTodo = {
					id: null,
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
{#each todoList.todos as todo}
	<ul>
		<TodoItem bind:todo />
	</ul>
{/each}
<input
	bind:value={newTodo.text}
	on:keydown|capture={handleAddTodo}
	name="text"
	type="text"
	autocomplete="off"
	placeholder="Todo item..."
	class="p-4 focus:outline-none rounded-3xl"
/>
