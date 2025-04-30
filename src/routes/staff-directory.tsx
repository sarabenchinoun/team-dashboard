import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { membersQuery } from "@/lib/queries/staff";

export const Route = createFileRoute("/staff-directory")({
	component: RouteComponent,
});

function RouteComponent() {
	const staff = useQuery(
		membersQuery({
			pageIndex: 1,
			pageSize: 5,
		}),
	);

	return (
		<>
			<div className="p-2">Hello from Staff Directory!</div>
			<div>{JSON.stringify(staff, null, 2)}</div>
		</>
	);
}
