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
