import { z } from 'zod';
import { zfd } from 'zod-form-data';

export const todoListSlotFormSchema = zfd.formData({
	slotId: zfd.numeric(),
	todoId: zfd.numeric(),
	title: zfd.text(z.string().min(0)),
	archived: zfd.checkbox()
});

export const todoFormSchema = zfd.formData({
	id: zfd.numeric(),
	todo_list_id: zfd.numeric(),
	text: zfd.text(z.string().min(0)),
	ordering: zfd.numeric(),
	completed: zfd.checkbox()
});

export const newTodoFormSchema = zfd.formData({
	todo_list_id: zfd.numeric(),
	text: zfd.text(z.string().min(0)),
	ordering: zfd.numeric(),
	completed: zfd.checkbox()
});

export const parseExistingTodos = (data: FormData, newTodoListid: number) => {
	return parseTodos(data, newTodoListid, 'todo.');
};

export const parseNewTodos = (data: FormData, newTodoListid: number) => {
	return parseTodos(data, newTodoListid, 'new.todo.');
};

export const parseTodosForm = (data: FormData, newTodoListid: number) => {
	const existingTodosForm = parseExistingTodos(data, newTodoListid);
	const newTodosForm = parseNewTodos(data, newTodoListid);

	type validatorFunction = typeof todoFormSchema.parse | typeof newTodoFormSchema.parse;
	const filterValid = (todos: ReturnType<typeof parseTodos>, validator: validatorFunction) => {
		const valids = [];
		for (const todo of todos) {
			try {
				valids.push(validator(todo));
			} catch (_) {
				// Exclude invalid items.
			}
		}
		return valids;
	};

	return {
		existing: filterValid(existingTodosForm, todoFormSchema.parse),
		new: filterValid(newTodosForm, newTodoFormSchema.parse)
	};
};

const parseTodos = (data: FormData, newTodoListid: number, prefix: string) => {
	const newTodos = new Map<string, Map<string, string | number>>();
	for (const key of data.keys()) {
		if (key.startsWith(prefix)) {
			const noPrefixKey = key.slice(prefix.length);
			const [ordering, type] = noPrefixKey.split('.');
			if (!newTodos.has(ordering)) {
				newTodos.set(
					ordering,
					new Map<string, string | number>([
						['ordering', ordering],
						['todo_list_id', newTodoListid]
					])
				);
			}
			if (data.get(key)) {
				newTodos.get(ordering)?.set(type, <string | number>data.get(key));
			}
		}
	}
	const insertTodos = [...newTodos.values()].map((m) => Object.fromEntries(m));
	return insertTodos;
};
