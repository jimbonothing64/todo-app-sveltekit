<script lang="ts">
	import NewSlotItemForm from '../lib/components/NewSlotItemForm.svelte';
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
					<h5
						class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white capitalize"
					>
						{taskSlot.note?.title}
					</h5>
					<p>{taskSlot.note?.text}</p>
					<input type="hidden" name="id" value={taskSlot.id} />
					<input type="hidden" name="noteId" value={taskSlot.note?.id} />
					<button formaction="?/deleteTaskSlot">delete</button>
				</form>
			{:else if taskSlot.todo_list_id}
				<form use:enhance method="POST">
					<h5
						class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white capitalize"
					>
						{taskSlot.todoList?.title}
					</h5>
					<input type="hidden" name="id" value={taskSlot.id} />
					<input type="hidden" name="todoListId" value={taskSlot.todoList?.id} />
					<button formaction="?/deleteTaskSlot">delete</button>
					<ul>
						{#each taskSlot.todoList?.todos as todo (todo.id)}
							<li>
								{todo.text}
							</li>
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
