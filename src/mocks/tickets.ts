import { http, HttpResponse } from "msw";

import { db } from "@/mock-db/db";
import { mockApi } from "./browser";

export const ticketsHandlers = [
	http.get(mockApi("/tickets"), () => {
		const tickets = db.ticket.getAll();
		return HttpResponse.json({ tickets: tickets ?? [] });
	}),
];
