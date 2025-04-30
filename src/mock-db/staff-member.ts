import { faker } from "@faker-js/faker/locale/en_GB";
import { type Insert, db } from "./db";

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

const createMember: Insert<"member"> = (overrides) =>
	db.member.create({
		name: faker.person.fullName(),
		role: faker.helpers.arrayElement(jobTitles),
		email: faker.internet.email(),
		status: faker.helpers.arrayElement(["active", "inactive"]),
		last_login: faker.date.recent().toISOString(),
		drive_usage: faker.number.int({ min: 0, max: 100 }),
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

export { createMember };
