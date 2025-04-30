import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { ticketsQuery } from "@/lib/queries/tickets";

export const Route = createFileRoute("/tickets")({
	component: RouteComponent,
});

function RouteComponent() {
	const tickets = useQuery(
		ticketsQuery({
			pageIndex: 1,
			pageSize: 5,
		}),
	);

	return (
		<>
			<div>Hello "/tickets"!</div>
			<div>{JSON.stringify(tickets, null, 2)}</div>
		</>
	);
}
