<script lang="ts">
	import type { Note } from '$lib/types';
	// export let newNote: Note;

	let showTitle = true;
	let containerDiv: HTMLDivElement;

	const handleFocus = () => {
		showTitle = true;
	};

	const handleBlur = () => {
		showTitle = containerDiv.contains(document.activeElement);
	};
</script>

{#if showTitle}
	<input
		name="title"
		type="text"
		autocomplete="off"
		placeholder="Title"
		class="pt-4 px-4 focus:outline-none text-2xl rounded-3xl font-bold tracking-tight"
	/>
{/if}
<input
	on:focus={handleFocus}
	name="text"
	type="text"
	autocomplete="off"
	placeholder="Your note.."
	class="p-4 focus:outline-none rounded-3xl"
/>
