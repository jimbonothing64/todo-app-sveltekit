import { z } from 'zod';
import { zfd } from 'zod-form-data';

export const noteSlotFormSchema = zfd.formData({
	slotId: zfd.numeric(),
	noteId: zfd.numeric(),
	title: zfd.text(z.string().min(0)),
	text: zfd.text(z.string().min(1, { message: 'Note cannot be empty' })),
	archived: zfd.checkbox()
});

export const newNoteSlotFormSchema = zfd.formData({
	title: zfd.text(z.string().min(0)),
	text: zfd.text(z.string().min(1, { message: 'Note cannot be empty' }))
});
