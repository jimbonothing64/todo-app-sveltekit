<script lang="ts">
	import type { Todo } from '$lib/types';
	export let todo: Todo;
</script>

<li>
	<input type="checkbox" class="rounded" />
	<input class="px-4 focus:outline-none rounded-3xl" type="text" />
</li>
