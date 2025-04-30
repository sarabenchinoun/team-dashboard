import { faker } from "@faker-js/faker/locale/en_GB";
import * as z from "zod";

import { db } from "./db";

const issuetypes = [
	{
		value: "wifi-connectivity",
		label: "Wifi Connectivity",
	},
	{
		value: "device-issue",
		label: "Device Issue",
	},
	{
		value: "software-issue",
		label: "Software Issue",
	},
	{
		value: "other",
		label: "Other",
	},
];

const ticketStatuses = [
	{ value: "open", label: "Open" },
	{ value: "pending", label: "Pending" },
	{ value: "resolved", label: "Resolved" },
];

const Ticket = z.object({
	id: z.number(),
	user: z.string().email(),
	issue: z.string(),
	description: z.string(),
	status: z.string(),
	created_at: z.string(),
});

type Ticket = z.infer<typeof Ticket>;

const createTicket = (overrides: Partial<Ticket> = {}) =>
	db.ticket.create({
		user: faker.internet.email(),
		issue: faker.helpers.arrayElement(issuetypes.map((i) => i.value)),
		description: faker.lorem.paragraph(),
		status: faker.helpers.arrayElement(ticketStatuses.map((s) => s.value)),
		created_at: faker.date.past().toISOString(),
		...overrides,
	});

export { createTicket, issuetypes, ticketStatuses };
