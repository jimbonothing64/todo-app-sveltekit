<script lang="ts">
	import NewSlotItemForm from '$lib/components/NewSlotItemForm.svelte';
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import type { NewSlotType } from '$lib/types';
	import TodoItem from '$lib/components/TodoItem.svelte';
	export let data: PageData;
	$: allTaskSlots = data.allTaskSlots;
</script>

<!-- <div
	class="w-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
>
	<form use:enhance method="POST" action="?/createTodoList">
		<div class="relative z-0 w-full mb-6 group">
			<label>
				New todo
				<input name="title" type="text" autocomplete="off" />
			</label>
		</div>
	</form>
	<form use:enhance method="POST" action="?/createNote">
		<div class="relative z-0 w-full mb-6 group">
			<label>
				New note
				<input name="title" type="text" autocomplete="off" />
				<input name="text" type="text" autocomplete="off" />
			</label>
			<button>+</button>
		</div>
	</form>
</div> -->

<div class="flex justify-center">
	<form use:enhance method="POST" action={'?/createSlot'} class="w-5/6">
		<NewSlotItemForm />
	</form>
</div>
<div class="flex pt-10 flex-wrap place-content-center gap-3 md:m-5">
	{#each allTaskSlots as taskSlot (taskSlot.id)}
		<div
			class="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
		>
			{#if taskSlot.note_id}
				<form use:enhance method="POST">
					<div class="flex flex-row justify-between">
						<h5
							class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white capitalize"
						>
							{taskSlot.note?.title}
						</h5>
						<button
							formaction="?/deleteTaskSlot"
							class="mb-2 pl-2.5 text-black dark:text-white hover:text-orange-600 focus:ring-4 focus:outline-none font-medium rounded-full text-sm text-center inline-flex items-center focus:ring-transparent"
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
									d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
								/>
							</svg>
						</button>
					</div>
					<p>{taskSlot.note?.text}</p>
					<input type="hidden" name="id" value={taskSlot.id} />
					<input type="hidden" name="noteId" value={taskSlot.note?.id} />
				</form>
			{:else if taskSlot.todo_list_id}
				<form use:enhance method="POST">
					<div class="flex flex-row justify-between">
						<h5
							class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white capitalize"
						>
							{taskSlot.todoList?.title}
						</h5>
						<input type="hidden" name="id" value={taskSlot.id} />
						<input type="hidden" name="todoListId" value={taskSlot.todoList?.id} />
						<button
							formaction="?/deleteTaskSlot"
							class="mb-2 pl-2.5 text-black dark:text-white hover:text-orange-600 focus:ring-4 focus:outline-none font-medium rounded-full text-sm text-center inline-flex items-center focus:ring-transparent"
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
									d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
								/>
							</svg>
						</button>
					</div>
					<ul>
						{#each taskSlot.todoList?.todos as todo (todo.id)}
							<TodoItem bind:todo />
						{/each}
						<li>
							<form use:enhance action="?/createTodo" method="POST">
								<input type="hidden" name="id" value={taskSlot.todoList?.id} />
								<input type="text" name="text" />
								<button>+</button>
							</form>
						</li>
					</ul>
				</form>

				<!-- {/each} -->
			{:else}
				<p>Oh no something went horribly wrong!</p>
			{/if}
		</div>
	{/each}
</div>
