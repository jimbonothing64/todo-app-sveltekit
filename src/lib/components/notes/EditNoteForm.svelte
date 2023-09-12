<script lang="ts">
	export let id: number;
	export let title: string;
	export let text: string;

	const focus = (el: HTMLInputElement | HTMLTextAreaElement) => {
		el.focus();
	};
</script>

<input
	value={title}
	name="title"
	class=" focus:outline-none text-2xl rounded-3xl font-bold tracking-tight"
/>
<textarea
	value={text}
	use:focus
	name="text"
	class="focus:outline-none rounded-3xl resize-none w-full h-72 md:h-96"
/>
<input type="hidden" name="noteId" value={id} />
