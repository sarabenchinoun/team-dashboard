import { AddTodo, TodoItem } from "@/components/todo-actions";
import { Skeleton } from "@/components/ui/skeleton";
import { todosQuery } from "@/lib/queries/todos";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/todo-list")({
	beforeLoad: ({ context }) => {
		context.queryClient.ensureQueryData(todosQuery());
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { data, isPending } = useQuery(todosQuery());

	return (
		<div className="mx-auto max-w-2xl p-2 ">
			<div className="flex flex-col justify-between gap-x-4 gap-y-2 sm:flex-row sm:items-center">
				<h1 className="font-bold text-2xl">To-do List</h1>
				<AddTodo />
			</div>
			<div className="py-6">
				<div className="space-y-2">
					{isPending ? (
						Array.from({ length: 6 }).map((_, i) => (
							<Skeleton key={i} className="h-10 w-full rounded" />
						))
					) : data?.todos.length ? (
						data.todos.map((todo) => <TodoItem key={todo.id} {...todo} />)
					) : (
						<div className="py-8 text-center text-muted-foreground">
							No todos found.
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
