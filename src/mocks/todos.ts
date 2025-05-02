import { http, HttpResponse } from "msw";
import * as z from "zod";

import { CreateTodo } from "@/lib/queries/todos";
import { db } from "@/mock-db/db";
import { mockApi } from "./browser";

export const todosHandlers = [
	http.get(mockApi("/todos"), () => {
		const todos = db.todo.getAll();
		return HttpResponse.json({ todos: todos ?? [] });
	}),
	http.post(mockApi("/todos"), async ({ request }) => {
		const body = CreateTodo.parse(await request.json());
		const todo = db.todo.create(body);

		if (!todo) {
			return HttpResponse.json(
				{
					message: "Todo not created",
				},
				{ status: 400 },
			);
		}

		return HttpResponse.json({ todo });
	}),
	http.delete(mockApi("/todos/:todoId"), async ({ params }) => {
		const todoId = z.string().transform(Number).parse(params.todoId);
		const todo = db.todo.delete({
			where: {
				id: {
					equals: todoId,
				},
			},
		});

		if (!todo) {
			return HttpResponse.json(
				{
					message: "Todo not deleted",
				},
				{ status: 400 },
			);
		}

		return HttpResponse.json({ todo });
	}),
	http.patch(mockApi("/todos/:todoId"), async ({ params, request }) => {
		const todoId = z.string().transform(Number).parse(params.todoId);
		const body = CreateTodo.partial().parse(await request.json());
		const todo = db.todo.update({
			where: {
				id: {
					equals: todoId,
				},
			},
			data: body,
		});

		if (!todo) {
			return HttpResponse.json(
				{
					message: "Todo not updated",
				},
				{ status: 400 },
			);
		}

		return HttpResponse.json({ todo });
	}),
];
