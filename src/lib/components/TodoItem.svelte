<script lang="ts">
	import type { Todo } from '$lib/types';
	export let todo: Todo;
</script>

<li>
	<input bind:value={todo.id} name="todo.{todo.ordering}.id" type="hidden" />
	<input bind:value={todo.ordering} name="todo.{todo.ordering}.ordering" type="hidden" />
	<input
		bind:checked={todo.completed}
		name="todo.{todo.ordering}.completed"
		class="text-green-600"
		type="checkbox"
	/>
	<input
		bind:value={todo.text}
		name="todo.{todo.ordering}.text"
		class="px-1 focus:outline-none rounded-3xl"
		type="text"
		placeholder="Todo item..."
	/>
</li>
