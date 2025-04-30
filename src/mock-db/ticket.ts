import { faker } from "@faker-js/faker/locale/en_GB";
import { type Insert, db } from "./db";

const createTicket: Insert<"ticket"> = (overrides) =>
	db.ticket.create({
		user: faker.internet.email(),
		issue: faker.lorem.sentence(),
		description: faker.lorem.paragraph(),
		status: faker.helpers.arrayElement(["open", "closed", "pending"]),
		created_at: faker.date.past().toISOString(),
		...overrides,
	});

export { createTicket };
