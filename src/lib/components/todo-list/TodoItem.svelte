<script lang="ts">
	export let id: number;
	export let todo_list_id: number | null = null;
	export let ordering: number;
	export let completed: boolean;
	export let text: string;
	export let namePrefix = '';
	export let handleDelte: (event: KeyboardEvent, id: number, text: string) => void;

	const prefix = () => (namePrefix !== '' ? `${namePrefix}.` : '');
</script>

{#if id}
	<input bind:value={id} name="{prefix()}todo.{ordering}.id" type="hidden" />
{/if}
{#if todo_list_id}
	<input bind:value={todo_list_id} name="{prefix()}todo.{ordering}.todo_list_id" type="hidden" />
{/if}
<input bind:value={ordering} name="{prefix()}todo.{ordering}.ordering" type="hidden" />
<input
	bind:checked={completed}
	name="{prefix()}todo.{ordering}.completed"
	class="text-green-600"
	type="checkbox"
/>
<input
	bind:value={text}
	on:keydown={(e) => handleDelte(e, id, text)}
	autocomplete=""
	name="{prefix()}todo.{ordering}.text"
	class="px-1 focus:outline-none rounded-3xl"
	type="text"
	placeholder="Todo item..."
/>
