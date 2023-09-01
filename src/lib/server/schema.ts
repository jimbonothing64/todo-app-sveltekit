import { relations } from 'drizzle-orm';
import { boolean, int, mysqlTable, serial, uniqueIndex, varchar } from 'drizzle-orm/mysql-core';

export const todos = mysqlTable('todos', {
	id: serial('id').primaryKey(),
	text: varchar('name', { length: 256 }),
	completed: boolean('completed').notNull().default(false),
	todo_list_id: int('todo_list_id').notNull()
});

export const todoLists = mysqlTable('todo_lists', {
	id: serial('id').primaryKey(),
	title: varchar('title', { length: 256 })
});

export const notes = mysqlTable('notes', {
	id: serial('id').primaryKey(),
	title: varchar('title', { length: 256 }),
	text: varchar('text', { length: 2048 }),
	ordering: int('ordering')
});

export const taskSlots = mysqlTable('task_slots', {
	id: serial('id').primaryKey(),
	ordering: int('ordering'),
	todo_list_id: int('todo_list_id'),
	note_id: int('note_id')
});

export const todosRelations = relations(todos, ({ one }) => ({
	todoLists: one(todoLists, {
		fields: [todos.todo_list_id],
		references: [todoLists.id]
	})
}));

export const todoListsRelations = relations(todoLists, ({ many }) => ({
	todos: many(todos)
}));

export const taskSlotsRelations = relations(taskSlots, ({ one }) => ({
	todoList: one(todoLists, {
		fields: [taskSlots.todo_list_id],
		references: [todoLists.id]
	}),
	note: one(notes, {
		fields: [taskSlots.note_id],
		references: [notes.id]
	})
}));
