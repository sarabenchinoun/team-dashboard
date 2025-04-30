import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { todosQuery } from "@/lib/queries/todos";

export const Route = createFileRoute("/todo-list")({
	component: RouteComponent,
});

function RouteComponent() {
	const todos = useQuery(todosQuery());

	return (
		<>
			<div>Hello "/todo-list"!</div>
			<div>{JSON.stringify(todos, null, 2)}</div>
		</>
	);
}
