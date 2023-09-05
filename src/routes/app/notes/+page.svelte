<script lang="ts">
	import NewSlotItemForm from '$lib/components/NewSlotItemForm.svelte';
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import TodoItem from '$lib/components/TodoItem.svelte';
	import NewNoteForm from '$lib/components/NewNoteForm.svelte';
	export let data: PageData;
	type editState = 'editing' | 'loading' | null;
	let editingtaskSlot = {};
	let editForm: HTMLFormElement | undefined;
	$: allTaskSlots = data.allTaskSlots;
	let editing: editState = null;

	const handleNoteClick = (slot) => {
		editing = 'editing';
		editingtaskSlot = slot;
		console.log(slot);
	};

	const handledExitEdit = () => {
		editForm?.submit();
		editing = null;
		editingtaskSlot = {};
	};

	/** Dispatch event on click outside of node */
	function clickOutside(node: HTMLElement) {
		const handleClick = (event: MouseEvent) => {
			if (node && !node.contains(event.target) && !event.defaultPrevented) {
				node.dispatchEvent(new CustomEvent('click_outside', node));
			}
		};

		document.addEventListener('click', handleClick, true);

		return {
			destroy() {
				document.removeEventListener('click', handleClick, true);
			}
		};
	}
</script>

<div class="flex justify-center">
	<form use:enhance method="POST" action={'?/createSlot'} class="w-5/6">
		<NewSlotItemForm />
	</form>
</div>
<div class="flex pt-10 flex-wrap place-content-center gap-3 md:m-5">
	{#each allTaskSlots as taskSlot (taskSlot.id)}
		{#if taskSlot.note_id}
			<div
				on:click={() => handleNoteClick(taskSlot)}
				class="max-w-sm p-6 bg-white border cursor-pointer border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
			>
				<form use:enhance method="POST">
					<div class="flex flex-row justify-between">
						<h5
							class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white capitalize"
						>
							{taskSlot.note?.title}
						</h5>
					</div>
					<p>{taskSlot.note?.text}</p>
					<input type="hidden" name="id" value={taskSlot.id} />
					<input type="hidden" name="noteId" value={taskSlot.note?.id} />
				</form>
			</div>
		{/if}
	{/each}
	{#if editing && editingtaskSlot}
		<div
			use:clickOutside
			on:click_outside={handledExitEdit}
			class="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
		>
			<form bind:this={editForm} use:enhance method="POST" action="?/updateNote">
				<div class="flex flex-row justify-between">
					<input
						bind:value={editingtaskSlot.note.title}
						name="title"
						class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white capitalize"
					/>
				</div>
				<div class="flex flex-row justify-between">
					<input
						bind:value={editingtaskSlot.note.text}
						name="text"
						class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white capitalize"
					/>

					<input type="hidden" name="slotId" value={editingtaskSlot.id} />
					<input type="hidden" name="noteId" value={editingtaskSlot.note?.id} />
				</div>
			</form>
		</div>
	{/if}
</div>
