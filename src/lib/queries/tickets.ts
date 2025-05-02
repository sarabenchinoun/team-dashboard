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
					file: z.string().optional().nullable(),
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

export const CreateTicket = z.object({
	user: z.string().email(),
	issue: z.string().min(1, "Issue is required"),
	description: z.string().min(1, "Description is required"),
	status: z.string().min(1, "Status is required"),
	file: z.instanceof(File).optional().nullable(),
});
export type CreateTicketProps = z.infer<typeof CreateTicket>;

export async function postTicket(body: FormData) {
	const res = await fetch("/api/v1/tickets", {
		method: "POST",
		body: body,
	});
	if (!res.ok) {
		throw new Error("Network response was not ok");
	}

	const json = await res.json();
	return json;
}
