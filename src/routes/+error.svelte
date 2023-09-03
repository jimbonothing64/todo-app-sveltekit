<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="flex flex-col items-center">
	<h1 class="text-2xl font-bold">{$page.status}</h1>
	<h2>{$page.error.message}</h2>
</div>
