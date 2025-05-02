import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";

export async function getTodos() {
	const res = await fetch("/api/v1/todos");
	if (!res.ok) {
		throw new Error("Network response was not ok");
	}
	const json = await res.json();
	return z
		.object({
			todos: z.array(
				z.object({
					id: z.number(),
					title: z.string(),
					completed: z.boolean(),
					created_at: z.string(),
				}),
			),
		})
		.parse(json);
}

export const todosQuery = () =>
	queryOptions({
		queryKey: ["todos"],
		queryFn: () => getTodos(),
	});

export const CreateTodo = z.object({
	title: z.string().min(1, "Title is required"),
	completed: z.boolean(),
});
export type CreateTodoProps = z.infer<typeof CreateTodo>;

export async function postTodo(body: CreateTodoProps) {
	const res = await fetch("/api/v1/todos", {
		method: "POST",
		body: JSON.stringify({
			title: body.title,
			completed: body.completed,
		}),
	});
	if (!res.ok) {
		throw new Error("Network response was not ok");
	}

	const json = await res.json();
	return json;
}

export async function updateTodo(
	todoId: number,
	body: Partial<CreateTodoProps>,
) {
	const res = await fetch(`/api/v1/todos/${todoId}`, {
		method: "PATCH",
		body: JSON.stringify(body),
	});
	if (!res.ok) {
		throw new Error("Network response was not ok");
	}

	const json = await res.json();
	return json;
}

export async function deleteTodo(todoId: number) {
	const res = await fetch(`/api/v1/todos/${todoId}`, {
		method: "DELETE",
	});
	if (!res.ok) {
		throw new Error("Network response was not ok");
	}

	const json = await res.json();
	return json;
}
