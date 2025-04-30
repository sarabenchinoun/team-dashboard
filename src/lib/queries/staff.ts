import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";
import type { PageParams } from "../pagination";

export async function getMembers(params: Partial<PageParams>) {
	const res = await fetch(
		`/api/v1/staff?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}`,
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
				total_records: z.number().transform((val) => val ?? 0),
				first_page: z.number().catch(1),
				last_page: z.number().catch(1),
			}),
			staff: z.array(
				z.object({
					id: z.number(),
					name: z.string(),
					email: z.string().email(),
					role: z.string(),
					status: z.boolean(),
					last_login: z.string(),
					drive_usage: z.string(),
					device: z.string(),
					created_at: z.string(),
				}),
			),
		})
		.parse(json);
}

export const membersQuery = (params: Partial<PageParams> = {}) =>
	queryOptions({
		queryKey: ["staff", params],
		queryFn: () => getMembers(params),
	});
