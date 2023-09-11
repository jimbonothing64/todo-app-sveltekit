<script lang="ts">
	import NewSlotItemForm from '$lib/components/NewSlotItemForm.svelte';
	import TodoItem from '$lib/components/TodoItem.svelte';
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import SlotCard from '$lib/components/slots/SlotCard.svelte';
	import NoteContents from '$lib/components/notes/NoteContents.svelte';
	import TodoListContents from '$lib/components/todo-list/TodoListContents.svelte';
	import ArchivedSlotCard from '$lib/components/slots/ArchivedSlotCard.svelte';

	export let data: PageData;

	$: allCurrent = data.allCurrent;
	$: allArchived = data.allArchived;
</script>

<div class="flex justify-center">
	<form use:enhance method="POST" action={'?/createSlot'} class="w-5/6">
		<NewSlotItemForm />
	</form>
</div>
<div class="flex pt-10 flex-wrap place-content-center gap-3 md:m-5">
	{#each allCurrent as taskSlot (taskSlot.id)}
		<SlotCard>
			{#if taskSlot.note_id}
				<NoteContents {...taskSlot.note} />
			{:else}
				<TodoListContents {...taskSlot.todoList} />
			{/if}
		</SlotCard>
	{/each}

	{#each allArchived as taskSlot (taskSlot.id)}
		<ArchivedSlotCard>
			{#if taskSlot.note_id}
				<NoteContents {...taskSlot.note} />
			{:else}
				<TodoListContents {...taskSlot.todoList} />
			{/if}
		</ArchivedSlotCard>
	{/each}
</div>
