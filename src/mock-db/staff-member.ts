import { faker } from "@faker-js/faker/locale/en_GB";

import * as z from "zod";
import { db } from "./db";

const jobTitles = [
	"Managing Director",
	"Head of Client Accounts",
	"Head of Film",
	"Creative Producer",
	"Executive Producer",
	"Finance Manager",
	"Account Manager",
	"Ei Account Manager",
	"Account Executive",
	"Head of Video and Digital",
	"Production Coordinator",
	"Senior Video Producer",
	"Director of Photography",
	"Senior Video Editor",
	"Video Producer",
];

const Member = z.object({
	id: z.number(),
	name: z.string(),
	role: z.string(),
	email: z.string().email(),
	status: z.boolean(),
	last_login: z.string(),
	drive_usage: z.string(),
	device: z.string(),
	created_at: z.string(),
});
type Member = z.infer<typeof Member>;

const createMember = (overrides: Partial<Member> = {}) =>
	db.member.create({
		name: faker.person.fullName(),
		role: faker.helpers.arrayElement(jobTitles),
		email: faker.internet.email(),
		status: faker.datatype.boolean(),
		last_login: faker.date.recent().toISOString(),
		drive_usage: `${faker.number.float({ min: 0.1, max: 100 }).toFixed(1)} GB`,
		device: faker.helpers.arrayElement([
			"Macbook Pro",
			"Macbook Air",
			"iMac",
			"Mac Mini",
			"iPad",
		]),
		created_at: faker.date.past().toISOString(),
		...overrides,
	});

export { createMember, type Member };
