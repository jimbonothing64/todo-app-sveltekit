import { zfd } from 'zod-form-data';

export const delteSlotSchema = zfd.formData({
	id: zfd.numeric(),
	noteId: zfd.numeric().optional(),
	todoListId: zfd.numeric().optional()
});
