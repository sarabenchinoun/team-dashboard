import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/staff-directory")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div className="p-2">Hello from Staff Directory!</div>;
}
