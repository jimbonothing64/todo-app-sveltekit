CREATE TABLE `todos` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(256),
	`completed` boolean NOT NULL,
	`todo_list_id` int NOT NULL,
	CONSTRAINT `todos_id` PRIMARY KEY(`id`)
);
