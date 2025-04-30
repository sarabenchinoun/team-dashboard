import * as z from "zod";

export const defaultPageParams = {
	pageIndex: 0,
	pageSize: 10,
};

export const PageParams = z.object({
	pageIndex: z.number().default(defaultPageParams.pageIndex),
	pageSize: z.number().default(defaultPageParams.pageSize),
});
export type PageParams = z.infer<typeof PageParams>;
