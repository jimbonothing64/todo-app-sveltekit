<script lang="ts">
	export let id: number;
	export let title: string;
	export let text: string;
</script>

<div class="flex flex-row justify-between">
	<h5 class="mb-2 text-2xl font-bold tracking-tight dark:text-white capitalize">
		{title}
	</h5>
</div>
<p class="whitespace-pre-wrap">{text}</p>
