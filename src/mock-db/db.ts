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

export type DB = typeof db;
type Table = keyof DB;
type Action = keyof DB[Table];
type Payload<T extends Table, A extends Action> = Parameters<DB[T][A]>[0];

export type Insert<T extends Table> = (
	payload?: Partial<Payload<T, "create">>,
) => NonNullable<ReturnType<DB[T]["create"]>>;
