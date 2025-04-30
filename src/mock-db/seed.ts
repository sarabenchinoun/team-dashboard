import { createMember } from "./staff-member";

export async function seed() {
	Array.from({ length: 10 }, () => createMember());
}
