import { faker } from "@faker-js/faker";
import { http, HttpResponse } from "msw";

export const ticketsHandlers = [
	http.get("/tickets", () => {
		const firstName = faker.person.firstName();
		const lastName = faker.person.lastName();
		return HttpResponse.json({
			id: crypto.randomUUID(),
			user: faker.internet.email({ firstName, lastName }),
			issue: faker.lorem.sentence(),
			description: faker.lorem.paragraph(),
			status: faker.helpers.arrayElement(["open", "closed", "pending"]),
			created_at: faker.date.past().toISOString(),
			updated_at: faker.date.recent().toISOString(),
		});
	}),
];
