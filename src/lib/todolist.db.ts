export const parse = (data: FormData, newTodoListid: string) => {
	const newTodos = {};
	for (const key of data.keys()) {
		if (key.startsWith('todo.')) {
			const [_, ordering, type] = key.split('.');
			if (!newTodos[ordering]) {
				newTodos[ordering] = { ordering, todo_list_id: newTodoListid, completed: false };
			}
			if (type == 'completed') {
				newTodos[ordering][type] = data.get(key) === 'on' ? true : false;
			} else {
				if (data.get(key)) {
					newTodos[ordering][type] = data.get(key);
				}
			}
		}
	}
	const insertTodos = Object.values(newTodos);
	return insertTodos;
};
