import { faker } from "@faker-js/faker/locale/en_GB";
import * as z from "zod";

import { db } from "./db";

const TodoSchema = z.object({
	id: z.number(),
	title: z.string(),
	completed: z.boolean(),
	created_at: z.string(),
});
type Todo = z.infer<typeof TodoSchema>;

const createTodo = (overrides: Partial<Todo> = {}) =>
	db.todo.create({
		title: faker.lorem.sentence(),
		completed: faker.datatype.boolean(),
		created_at: faker.date.past().toISOString(),
		...overrides,
	});

export { createTodo };
