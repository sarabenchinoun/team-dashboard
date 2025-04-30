import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";
import type { PageParams } from "../pagination";

export async function getTickets(params: Partial<PageParams> = {}) {
	const res = await fetch(
		`/api/v1/tickets?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}`,
	);
	if (!res.ok) {
		throw new Error("Network response was not ok");
	}
	const json = await res.json();
	return z
		.object({
			metadata: z.object({
				current_page: z.number().catch(1),
				page_size: z.number().catch(10),
				total_records: z.number().catch(0),
				first_page: z.number().catch(1),
				last_page: z.number().catch(1),
			}),
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

export const ticketsQuery = (params: Partial<PageParams> = {}) =>
	queryOptions({
		queryKey: ["tickets", params],
		queryFn: () => getTickets(params),
	});
