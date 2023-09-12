import { relations } from 'drizzle-orm';
import {
	boolean,
	index,
	int,
	bigint,
	mysqlTable,
	serial,
	uniqueIndex,
	varchar
} from 'drizzle-orm/mysql-core';

export const todos = mysqlTable(
	'todos',
	{
		id: serial('id').primaryKey(),
		text: varchar('name', { length: 256 }),
		completed: boolean('completed').notNull().default(false),
		ordering: int('ordering').notNull(),
		todo_list_id: int('todo_list_id').notNull()
	},
	(table) => {
		return {
			todo_list_id_idx: index('todo_list_id_idx').on(table.todo_list_id)
		};
	}
);

export const todoLists = mysqlTable('todo_lists', {
	id: serial('id').primaryKey(),
	title: varchar('title', { length: 256 })
});

export const notes = mysqlTable('notes', {
	id: serial('id').primaryKey(),
	title: varchar('title', { length: 256 }),
	text: varchar('text', { length: 2048 })
});

export const taskSlots = mysqlTable(
	'task_slots',
	{
		id: serial('id').primaryKey(),
		ordering: int('ordering'),
		todo_list_id: int('todo_list_id'),
		note_id: int('note_id'),
		user_id: varchar('user_id', {
			length: 15
		}).notNull(),
		archived: boolean('archived').notNull().default(false)
	},
	(table) => {
		return {
			slot_todo_list_id_idx: index('slot_todo_list_id_idx').on(table.todo_list_id),
			slot_note_id_idx: index('slot_note_id_idx').on(table.note_id)
		};
	}
);

// Lucia tables
export const user = mysqlTable('auth_user', {
	id: varchar('id', {
		length: 15 // change this when using custom user ids
	}).primaryKey(),
	username: varchar('username', { length: 35 }).notNull()
});

export const key = mysqlTable('user_key', {
	id: varchar('id', {
		length: 255
	}).primaryKey(),
	userId: varchar('user_id', {
		length: 15
	}).notNull(),
	hashedPassword: varchar('hashed_password', {
		length: 255
	})
});

export const session = mysqlTable('user_session', {
	id: varchar('id', {
		length: 128
	}).primaryKey(),
	userId: varchar('user_id', {
		length: 15
	}).notNull(),
	activeExpires: bigint('active_expires', {
		mode: 'number'
	}).notNull(),
	idleExpires: bigint('idle_expires', {
		mode: 'number'
	}).notNull()
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
	}),
	user: one(user, {
		fields: [taskSlots.user_id],
		references: [user.id]
	})
}));

export const userRelations = relations(user, ({ many }) => ({
	taskSlots: many(taskSlots)
}));
