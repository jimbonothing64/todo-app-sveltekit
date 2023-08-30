import { relations } from 'drizzle-orm';
import {
	boolean,
	int,
	mysqlEnum,
	mysqlTable,
	serial,
	uniqueIndex,
	varchar
} from 'drizzle-orm/mysql-core';

export const todos = mysqlTable('todos', {
	id: serial('id').primaryKey(),
	text: varchar('name', { length: 256 }),
	completed: boolean('completed').notNull(),
	todo_list_id: int('todo_list_id').notNull()
});

export const todoLists = mysqlTable('todo_lists', {
	id: serial('id').primaryKey(),
	title: varchar('name', { length: 256 })
});

export const todoListsRelations = relations(todoLists, ({ many }) => ({
	todos: many(todos)
}));

export const todosRelations = relations(todos, ({ one }) => ({
	author: one(todoLists, {
		fields: [todos.todo_list_id],
		references: [todoLists.id]
	})
}));
