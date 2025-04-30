import { faker } from "@faker-js/faker/locale/en_GB";
import { type Insert, db } from "./db";

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

const createTicket: Insert<"ticket"> = (overrides) =>
	db.ticket.create({
		user: faker.internet.email(),
		issue: faker.helpers.arrayElement(issuetypes.map((i) => i.value)),
		description: faker.lorem.paragraph(),
		status: faker.helpers.arrayElement(ticketStatuses.map((s) => s.value)),
		created_at: faker.date.past().toISOString(),
		...overrides,
	});

export { createTicket, issuetypes, ticketStatuses };
