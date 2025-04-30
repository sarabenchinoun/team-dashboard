import { faker } from "@faker-js/faker/locale/en_GB";
import { type Insert, db } from "./db";

const createTodo: Insert<"todo"> = (overrides) =>
	db.todo.create({
		title: faker.lorem.sentence(),
		completed: faker.datatype.boolean(),
		created_at: faker.date.past().toISOString(),
		...overrides,
	});

export { createTodo };
