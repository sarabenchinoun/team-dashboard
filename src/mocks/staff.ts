import { http, HttpResponse, delay } from "msw";
import * as z from "zod";

import { db } from "@/mock-db/db";
import { mockApi } from "./browser";

export const staffHandlers = [
	http.get(mockApi("/staff"), ({ request }) => {
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
		const total = db.member.count();

		const skip = pageIndex * pageSize;

		const staff = db.member.findMany({
			take: pageSize,
			skip: skip,
			orderBy: { created_at: "desc" },
		});

		delay(1000);

		return HttpResponse.json({
			metadata: {
				current_page: pageIndex,
				page_size: pageSize,
				total_records: total,
				first_page: 0,
				last_page: Math.ceil(total / pageSize),
			},
			staff: staff ?? [],
		});
	}),
];
