import { factory, primaryKey } from "@mswjs/data";

const asscendingId = (() => {
	let id = 1;
	return () => id++;
})();

const asscendingTicketId = (() => {
	let id = 100;
	return () => id++;
})();

export const db = factory({
	member: {
		id: primaryKey(asscendingId),
		name: String,
		role: String,
		email: String,
		status: String,
		drive_usage: Number,
		device: String,
		last_login: () => new Date().toISOString(),
		created_at: () => new Date().toISOString(),
	},
	ticket: {
		id: primaryKey(asscendingTicketId),
		user: String,
		issue: String,
		description: String,
		status: String,
		created_at: () => new Date().toISOString(),
	},
	todo: {
		id: primaryKey(asscendingId),
		title: String,
		completed: Boolean,
		created_at: () => new Date().toISOString(),
	},
});
