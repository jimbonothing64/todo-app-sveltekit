<script lang="ts">
	import NewSlotItemForm from '$lib/components/slots/NewSlotItemForm.svelte';
	import type { PageData } from './$types';
	import SlotCard from '$lib/components/slots/SlotCard.svelte';
	import ArchivedSlotCard from '$lib/components/slots/ArchivedSlotCard.svelte';
	import TodoListContents from '$lib/components/todo-list/TodoListContents.svelte';
	import EditSlotForm from '$lib/components/slots/EditSlotForm.svelte';
	export let data: PageData;

	$: allCurrent = data.allCurrent;
	$: allArchived = data.allArchived;
	let editingTaskSlot: (typeof allCurrent)[number];
	type EditState = 'editing' | 'loading' | 'not';
	let editing: EditState = 'not';

	const handleNoteClick = async (slot) => {
		editing = 'editing';
		editingTaskSlot = slot;
	};
</script>

<div class="flex justify-center">
	<NewSlotItemForm />
</div>
<div class="flex pt-10 flex-wrap place-content-center gap-3 md:m-5">
	{#each allCurrent as taskSlot (taskSlot.id)}
		<SlotCard on:click={() => handleNoteClick(taskSlot)}>
			<TodoListContents {...taskSlot.todoList} />
		</SlotCard>
	{/each}
	{#each allArchived as taskSlot (taskSlot.id)}
		<ArchivedSlotCard on:click={() => handleNoteClick(taskSlot)}>
			<TodoListContents {...taskSlot.todoList} />
		</ArchivedSlotCard>
	{/each}
	{#if editingTaskSlot}
		<EditSlotForm bind:editing {editingTaskSlot} />
	{/if}
</div>
