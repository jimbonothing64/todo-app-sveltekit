import { z } from 'zod';
import { zfd } from 'zod-form-data';

const loginSchema = z.object({
	username: z
		.string({})
		.min(1, { message: 'Username is required' })
		.max(32, { message: 'Username must be at most 32 chars long' })
		.toLowerCase(),
	password: z
		.string()
		.min(1, { message: 'Password is required' })
		.max(255, { message: 'Password must be at most 255 chars long' })
});

const registerSchema = z
	.object({
		username: z
			.string()
			.min(4, { message: 'Username must be at least 4 chars long' })
			.max(32, { message: 'Username must be at most 32 chars long' })
			.toLowerCase(),
		password: z
			.string()
			.min(6, { message: 'Password must be at least 6 chars long' })
			.max(255, { message: 'Password must be at most 255 chars long' }),
		confirmPassword: z
			.string()
			.min(6, { message: 'Confirm Password must be at least 6 chars long' })
			.max(255, { message: 'Confirm Password must be at most 255 chars long' })
	})
	.superRefine(({ password, confirmPassword }, ctx) => {
		if (password !== confirmPassword) {
			ctx.addIssue({
				code: 'custom',
				message: 'Password and Confirm Password must match',
				path: ['password']
			});
		}
	});

export const noteSlotFormSchema = zfd.formData({
	slotId: zfd.numeric(),
	noteId: zfd.numeric(),
	title: zfd.text(z.string().min(0)),
	text: zfd.text(z.string().min(1, { message: 'Note cannot be empty' })),
	archived: zfd.checkbox()
});

export const loginFormSchema = zfd.formData(loginSchema);
export const registerFormSchema = zfd.formData(registerSchema);
