<script lang="ts">
	import { enhance } from '$app/forms';
	import EditNoteForm from '../notes/EditNoteForm.svelte';
	import EditTodoListForm from '../todo-list/EditTodoListForm.svelte';

	export let editingTaskSlot;
	$: note = editingTaskSlot.note;
	$: todo = editingTaskSlot.todoList;

	type EditState = 'editing' | 'loading' | 'not';
	export let editing: EditState = 'not';

	let editForm: HTMLFormElement | undefined;

	const handledExitEdit = () => {
		editForm?.requestSubmit();
		editing = 'not';
	};

	const getAction = () => {
		return note ? '/app/notes?/updateSlot' : '/app/todos?/updateSlot';
	};
</script>

{#if editing === 'editing'}
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
			<form bind:this={editForm} use:enhance method="POST" action={getAction()}>
				{#if note}
					<EditNoteForm {...note} />
				{:else if todo}
					<EditTodoListForm {...todo} />
				{/if}

				<input type="hidden" name="slotId" value={editingTaskSlot.id} />
				<div class="flex flex-row justify-between">
					<div class="flex rounded-xl hover:bg-gray-300 p-2">
						<input
							checked={editingTaskSlot.archived}
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
