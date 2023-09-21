<script lang="ts">
	import type { Todo } from '$lib/types';
	import TodoItem from '$lib/components/todo-list/TodoItem.svelte';
	export let showTitle = true;
	export let todos: Todo[] = [];
	let newTodos: Todo[] = [];
	let deleteTodos: Todo[] = [];
	let newTodo: Todo = {
		id: null,
		ordering: todos.length,
		text: '',
		completed: false
	};

	const handleAddTodo = (event: KeyboardEvent) => {
		if (event.key === 'Enter') {
			if (newTodo.text !== '') {
				newTodos = [...newTodos, newTodo];
				newTodo = {
					id: -(todos.length + newTodos.length),
					ordering: todos.length + newTodos.length,
					text: '',
					completed: false
				};
				event.preventDefault(); // Add new todo, without form submit.
			}
			// Form submit.
		}
	};

	const handleDelteTodo = (event: KeyboardEvent, id: number, text: string) => {
		if (event.key === 'Backspace') {
			if (newTodos.length + todos.length > 1 && text.length <= 1) {
				deleteTodos = [...deleteTodos, ...todos.filter((t) => t.id == id)];
				todos = todos.filter((t) => t.id != id);
			}
		}
	};

	const handleDeleteClientTodo = (event: KeyboardEvent, id: number, text: string) => {
		event.key, id;
		if (event.key === 'Backspace') {
			if (newTodos.length + todos.length > 1 && text.length <= 1) {
				newTodos = newTodos.filter((t) => t.id != id);
			}
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
	{#each todos as todo (todo.id)}
		<li><TodoItem {...todo} handleDelte={handleDelteTodo} /></li>
	{/each}
	{#each newTodos as todo (todo.id)}
		<li><TodoItem {...todo} namePrefix="new" handleDelte={handleDeleteClientTodo} /></li>
	{/each}
	{#each deleteTodos as todo}
		<input bind:value={todo.id} name="del.todo.id.{todo.id}" type="hidden" />
	{/each}
	<li>
		<input
			bind:value={newTodo.completed}
			name="new.todo.{newTodo.ordering}.completed"
			class="text-green-600"
			type="checkbox"
		/>
		<input
			bind:value={newTodo.text}
			on:keydown|capture={handleAddTodo}
			name="new.todo.{newTodo.ordering}.text"
			type="text"
			autocomplete="off"
			placeholder="Todo item..."
			class=" px-1 focus:outline-none rounded-3xl"
		/>
	</li>
</ul>
