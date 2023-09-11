<script lang="ts">
	export let id: number | null;
	export let ordering: number;
	export let completed: boolean;
	export let text: string;
</script>

{#if id}
	<input bind:value={id} name="todo.{ordering}.id" type="hidden" />
{/if}
<input bind:value={ordering} name="todo.{ordering}.ordering" type="hidden" />
<input
	bind:checked={completed}
	name="todo.{ordering}.completed"
	class="text-green-600"
	type="checkbox"
/>
<input
	bind:value={text}
	autocomplete=""
	name="todo.{ordering}.text"
	class="px-1 focus:outline-none rounded-3xl"
	type="text"
	placeholder="Todo item..."
/>
