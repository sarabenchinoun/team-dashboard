import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/staff-directory")({
	loader: async () => {
		const res = await fetch("/api/v1/staff");
		const json = await res.json();
		return json;
	},
	component: RouteComponent,
});

function RouteComponent() {
	const staff = Route.useLoaderData();

	return (
		<>
			<div className="p-2">Hello from Staff Directory!</div>
			<div>{JSON.stringify(staff, null, 2)}</div>
		</>
	);
}
