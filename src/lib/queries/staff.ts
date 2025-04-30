import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";

export async function getMembers() {
	const res = await fetch("/api/v1/staff");
	if (!res.ok) {
		throw new Error("Network response was not ok");
	}
	const json = await res.json();
	return z
		.object({
			staff: z.array(
				z.object({
					id: z.number(),
					name: z.string(),
					email: z.string().email(),
					role: z.string(),
					status: z.string(),
					last_login: z.string(),
					drive_usage: z.number(),
					device: z.string(),
					created_at: z.string(),
				}),
			),
		})
		.parse(json);
}

export const membersQuery = () =>
	queryOptions({
		queryKey: ["staff"],
		queryFn: () => getMembers(),
	});
