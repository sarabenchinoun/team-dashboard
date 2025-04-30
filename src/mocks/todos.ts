import { http, HttpResponse } from "msw";

import { db } from "@/mock-db/db";
import { mockApi } from "./browser";

export const todosHandlers = [
	http.get(mockApi("/todos"), () => {
		const todos = db.todo.getAll();
		return HttpResponse.json({ todos: todos ?? [] });
	}),
];
