<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="flex flex-col items-center gap-4">
	<h1 class="text-2xl font-bold">{$page.status}</h1>
	<h2>{$page.error.message}</h2>
	<a
		href="/app"
		class="inline-flex items-center justify-center px-5 py-3 text-white font-medium text-center text-gray-900 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 bg-orange-500 dark:text-black dark:border-gray-700 dark:hover:bg-orange-500 dark:focus:ring-gray-800"
		>Back to app</a
	>
</div>
