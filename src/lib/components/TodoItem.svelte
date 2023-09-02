<script lang="ts">
	import type { Todo } from '$lib/types';
	export let todo: Todo;
</script>

<li>
	<input bind:value={todo.completed} class="text-green-600" type="checkbox" />
	<input bind:value={todo.text} class="px-4 focus:outline-none rounded-3xl" type="text" />
</li>
