<script lang="ts">
	import NewNoteForm from '../notes/NewNoteForm.svelte';
	import NewTodoListForm from '../todo-list/NewTodoListForm.svelte';
	import type { NewSlotType } from '$lib/types';
	import { enhance } from '$app/forms';

	let formType: NewSlotType = 'note';

	const handleTodoListClick = () => {
		formType = 'todo list';
	};

	const handleNoteClick = () => {
		formType = 'note';
	};
</script>

<form use:enhance method="POST" action="/app?/createSlot" class="w-5/6">
	<input type="hidden" name="type" value={formType} />
	<div
		class="flex flex-col dark:bg-gray-800 dark:border-gray-700 border border-gray-200 rounded-3xl shadow"
	>
		{#if formType === 'note'}
			<NewNoteForm />
		{:else if formType === 'todo list'}
			<NewTodoListForm />
		{:else}
			<p>Bad form type :(</p>
		{/if}
		<div class="flex justify-end">
			{#if formType === 'note'}
				<button
					on:mouseup={handleTodoListClick}
					class=" text-black dark:text-white hover:text-orange-600 focus:ring-4 focus:outline-none font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center focus:ring-transparent"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
						/>
					</svg>

					<span class="sr-only">Make todo list</span>
				</button>
			{:else if formType === 'todo list'}
				<button
					on:mouseup={handleNoteClick}
					class=" text-black dark:text-white hover:text-orange-600 focus:ring-4 focus:outline-none font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center focus:ring-transparent"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
						/>
					</svg>

					<span class="sr-only">Make note</span>
				</button>
			{/if}
			<button
				class=" text-black dark:text-white hover:text-orange-600 focus:ring-4 focus:outline-none font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center focus:ring-transparent"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-6 h-6"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
				</svg>

				<span class="sr-only">Add </span>
			</button>
		</div>
	</div>
</form>
