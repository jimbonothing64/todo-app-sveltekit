<script lang="ts">
	import { page } from '$app/stores';
	import SideBar from '$lib/components/SideBar.svelte';
	import NewSlotItemForm from '$lib/components/slots/NewSlotItemForm.svelte';
	import type { NewSlotType } from '$lib/types';
	import type { SubmitFunction } from '@sveltejs/kit';

	let formType: NewSlotType = 'note';
	let loading = false;

	const submitNewSlotItem: SubmitFunction = ({
		formElement,
		formData,
		action,
		cancel,
		submitter
	}) => {
		loading = true;
		return async ({ result, update }) => {
			loading = false;
			console.log(result);
			if (result.type === 'success') {
				formType = 'note';
				await update();
			}
		};
	};
</script>

<SideBar />

<div class="p-4 sm:ml-16">
	<div class="flex justify-center">
		<NewSlotItemForm use={submitNewSlotItem} bind:formType bind:loading />
	</div>
	<slot />
</div>
