<script lang="ts">
	import NewSlotItemForm from '$lib/components/NewSlotItemForm.svelte';
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	export let data: PageData;
	type editState = 'editing' | 'loading' | null;
	let editingtaskSlot = {};
	let editForm: HTMLFormElement | undefined;
	let editNoteInput: HTMLInputElement | undefined;
	$: allTaskSlots = data.allTaskSlots;
	let editing: editState = null;

	const handleNoteClick = async (slot) => {
		editing = 'editing';
		editingtaskSlot = slot;
		setTimeout(() => editNoteInput?.focus(), 400);
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
	{#each allTaskSlots as taskSlot (taskSlot.id)}
		{#if taskSlot.note_id}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-interactive-supports-focus -->
			<div
				on:click={() => handleNoteClick(taskSlot)}
				role="button"
				class="max-w-sm p-6 break-words hyphens-auto bg-white border cursor-pointer border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
			>
				<form use:enhance method="POST">
					<div class="flex flex-row justify-between">
						<h5
							class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white capitalize"
						>
							{taskSlot.note?.title}
						</h5>
					</div>
					<p class="whitespace-pre-wrap">{taskSlot.note?.text}</p>
					<input type="hidden" name="id" value={taskSlot.id} />
					<input type="hidden" name="noteId" value={taskSlot.note?.id} />
				</form>
			</div>
		{/if}
	{/each}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	{#if editing && editingtaskSlot}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			on:click={() => handledExitEdit()}
			id="menu"
			class="fixed top-0 z-90 w-full h-full flex justify-center items-center backdrop-brightness-75 backdrop-blur-md"
		>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				on:click|stopPropagation
				class="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
			>
				<form bind:this={editForm} use:enhance method="POST" action="?/updateSlot">
					<div class="flex flex-row justify-between">
						<input
							bind:value={editingtaskSlot.note.title}
							name="title"
							class=" focus:outline-none text-2xl rounded-3xl font-bold tracking-tight"
						/>
					</div>
					<textarea
						bind:this={editNoteInput}
						bind:value={editingtaskSlot.note.text}
						name="text"
						class="focus:outline-none rounded-3xl resize-none w-full h-72 md:h-96"
					/>
					<input type="hidden" name="slotId" value={editingtaskSlot.id} />
					<input type="hidden" name="noteId" value={editingtaskSlot.note?.id} />
					<div class="flex flex-row justify-end">
						<div class="flex">
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
								class="absolute w-6 h-6 peer-checked:!fill-black"
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
					</div>
				</form>
			</div>
		</div>
	{/if}
</div>
