import { http, HttpResponse } from "msw";

import { db } from "@/mock-db/db";
import { mockApi } from "./browser";

export const staffHandlers = [
	http.get(mockApi("/staff"), () => {
		const staff = db.member.getAll();
		return HttpResponse.json({ staff: staff ?? [] });
	}),
];
