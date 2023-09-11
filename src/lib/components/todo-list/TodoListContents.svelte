<script lang="ts">
	import type { Todo } from '$lib/types';

	export let id: number;
	export let title: string;
	export let todos: Array<Todo>;
</script>

<div class="flex flex-row justify-between">
	<h5 class="mb-2 text-2xl font-bold tracking-tight dark:text-white capitalize">
		{title}
	</h5>
</div>
<ul>
	{#each todos as todo}
		<li>
			<input on:click|stopPropagation name="completed" class="text-green-600" type="checkbox" />
			{todo.text}
		</li>
	{/each}
</ul>
