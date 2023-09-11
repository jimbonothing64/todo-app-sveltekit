<script lang="ts">
	import NewSlotItemForm from '$lib/components/slots/NewSlotItemForm.svelte';
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import SlotCard from '$lib/components/slots/SlotCard.svelte';
	import ArchivedSlotCard from '$lib/components/slots/ArchivedSlotCard.svelte';
	import TodoListContents from '$lib/components/todo-list/TodoListContents.svelte';
	import TodoItem from '$lib/components/todo-list/TodoItem.svelte';
	import NewTodoListForm from '$lib/components/todo-list/NewTodoListForm.svelte';
	export let data: PageData;

	type editState = 'editing' | 'loading' | null;

	let editingtaskSlot = {};
	let editForm: HTMLFormElement | undefined;
	let editNoteInput: HTMLInputElement | undefined;
	let editing: editState = null;

	$: allCurrent = data.allCurrent;
	$: allArchived = data.allArchived;

	const handleNoteClick = async (slot) => {
		editing = 'editing';
		editingtaskSlot = slot;
	};

	const focus = (el: HTMLInputElement | HTMLTextAreaElement) => {
		el.focus();
	};

	const handledExitEdit = () => {
		editForm?.requestSubmit();
		editing = null;
		editingtaskSlot = {};
	};
</script>

<div class="flex justify-center">
	<form use:enhance method="POST" action={'?/createSlot'} class="w-5/6">
		<NewSlotItemForm />
	</form>
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

	{#if editing && editingtaskSlot}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			on:click={() => handledExitEdit()}
			id="menu"
			class="fixed top-0 z-90 w-full h-full flex justify-center items-center backdrop-blur-md"
		>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				on:click|stopPropagation
				class="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
			>
				<form bind:this={editForm} use:enhance method="POST" action="?/updateSlot">
					<div class="flex flex-row justify-between">
						<input
							bind:value={editingtaskSlot.todoList.title}
							name="title"
							class=" focus:outline-none text-2xl rounded-3xl font-bold tracking-tight"
						/>
					</div>
					<ul>
						<!-- {#each editingtaskSlot.todoList.todos as todo}
							<li><TodoItem {...todo} /></li>
						{/each} -->
						<NewTodoListForm bind:todos={editingtaskSlot.todoList.todos} showTitle={false} />
					</ul>
					<input type="hidden" name="slotId" value={editingtaskSlot.id} />
					<input type="hidden" name="todoId" value={editingtaskSlot.todoList?.id} />
					<div class="flex flex-row justify-between">
						<div class="flex rounded-xl hover:bg-gray-300 p-2">
							<input
								bind:checked={editingtaskSlot.archived}
								type="checkbox"
								name="archived"
								class="z-50 peer relative appearance-none shrink-0 w-6 h-6 mt-1"
							/>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="grey"
								class="absolute w-6 h-6 rounded peer-checked:fill-black"
							>
								<path
									d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375z"
								/>
								<path
									fill-rule="evenodd"
									d="M3.087 9l.54 9.176A3 3 0 006.62 21h10.757a3 3 0 002.995-2.824L20.913 9H3.087zm6.163 3.75A.75.75 0 0110 12h4a.75.75 0 010 1.5h-4a.75.75 0 01-.75-.75z"
									clip-rule="evenodd"
								/>
							</svg>
						</div>
						<button
							on:click={() => handledExitEdit()}
							class="font-bold rounded-lg hover:bg-gray-300 p-2">close</button
						>
					</div>
				</form>
			</div>
		</div>
	{/if}
</div>
