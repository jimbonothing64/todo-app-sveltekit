<script lang="ts">
	import type { Todo } from '$lib/types';
	import NewTodoListForm from './NewTodoListForm.svelte';
	export let id: number;
	export let title: string;
	export let todos: [Todo];
</script>

<div class="flex flex-row justify-between">
	<input
		bind:value={title}
		name="title"
		class=" focus:outline-none text-2xl rounded-3xl font-bold tracking-tight"
	/>
</div>
<ul>
	<NewTodoListForm {todos} showTitle={false} />
</ul>
<input type="hidden" name="todoId" value={id} />
