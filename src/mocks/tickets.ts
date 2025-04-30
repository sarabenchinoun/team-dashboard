import { http, HttpResponse } from "msw";
import * as z from "zod";

import { CreateTicket } from "@/lib/queries/tickets";
import { db } from "@/mock-db/db";
import { mockApi } from "./browser";

export const ticketsHandlers = [
	http.get(mockApi("/tickets"), ({ request }) => {
		const url = new URL(request.url);
		const { pageIndex, pageSize } = z
			.object({
				pageIndex: z.string().transform(Number).catch(0),
				pageSize: z.string().transform(Number).catch(10),
			})
			.parse({
				pageIndex: url.searchParams.get("pageIndex"),
				pageSize: url.searchParams.get("pageSize"),
			});
		const total = db.ticket.count();

		const skip = pageIndex * pageSize;

		const tickets = db.ticket.findMany({
			take: pageSize,
			skip: skip,
			orderBy: { created_at: "desc" },
		});

		return HttpResponse.json({
			metadata: {
				current_page: pageIndex,
				page_size: pageSize,
				total_records: total,
				first_page: 1,
				last_page: Math.ceil(total / pageSize),
			},
			tickets: tickets ?? [],
		});
	}),
	http.post(mockApi("/tickets"), async ({ request }) => {
		const body = CreateTicket.parse(await request.json());

		const ticket = db.ticket.create({
			user: body.user,
			issue: body.issue,
			description: body.description,
			status: body.status,
		});

		if (!ticket) {
			return HttpResponse.json(
				{
					message: "Ticket not created",
				},
				{ status: 400 },
			);
		}

		return HttpResponse.json(ticket);
	}),
];
