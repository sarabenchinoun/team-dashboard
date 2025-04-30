import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";

export async function getTickets() {
	const res = await fetch("/api/v1/tickets");
	if (!res.ok) {
		throw new Error("Network response was not ok");
	}
	const json = await res.json();
	return z
		.object({
			tickets: z.array(
				z.object({
					id: z.number(),
					user: z.string().email(),
					issue: z.string(),
					description: z.string(),
					status: z.string(),
					created_at: z.string(),
				}),
			),
		})
		.parse(json);
}

export const ticketsQuery = () =>
	queryOptions({
		queryKey: ["tickets"],
		queryFn: () => getTickets(),
	});
