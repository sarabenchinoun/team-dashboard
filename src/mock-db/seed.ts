import { createMember } from "./staff-member";
import { createTicket } from "./ticket";
import { createTodo } from "./todo";

export async function seed() {
	Array.from({ length: 10 }, () => createMember());
	Array.from({ length: 10 }, () => createTicket());
	Array.from({ length: 10 }, () => createTodo());
}
