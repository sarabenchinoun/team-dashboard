import { CreateTicket } from "@/lib/queries/tickets";
import { db } from "@/mock-db/db";
import { http, HttpResponse } from "msw";
import * as z from "zod";
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
		try {
			const formData = await request.formData();
			const user = formData.get("user") as string;
			const issue = formData.get("issue") as string;
			const description = formData.get("description") as string;
			const status = formData.get("status") as string;
			const file = formData.get("file") as File | null;

			const parsedBody = CreateTicket.parse({
				user,
				issue,
				description,
				status,
				file,
			});

			const ticket = db.ticket.create({
				user: parsedBody.user,
				issue: parsedBody.issue,
				description: parsedBody.description,
				status: parsedBody.status,
				file: parsedBody.file ? parsedBody.file.name : undefined,
			});

			if (!ticket) {
				return HttpResponse.json(
					{ message: "Ticket not created" },
					{ status: 400 },
				);
			}

			return HttpResponse.json({
				...ticket,
				message: "Ticket created successfully",
			});
		} catch (error) {
			if (error instanceof z.ZodError) {
				return HttpResponse.json(
					{ message: "Validation failed", errors: error.errors },
					{ status: 400 },
				);
			}
			return HttpResponse.json(
				{ message: "Internal server error" },
				{ status: 500 },
			);
		}
	}),
];
