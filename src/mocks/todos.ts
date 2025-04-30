import { faker } from "@faker-js/faker";
import { http, HttpResponse } from "msw";

export const todosHandlers = [
	http.get("/todos", () => {
		return HttpResponse.json({
			id: crypto.randomUUID(),
			title: faker.lorem.sentence(),
			completed: faker.datatype.boolean(),
			created_at: faker.date.past().toISOString(),
			updated_at: faker.date.recent().toISOString(),
		});
	}),
];
