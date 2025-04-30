import { staffHandlers } from "./staff";
import { ticketsHandlers } from "./tickets";
import { todosHandlers } from "./todos";

export const handlers = [
	...staffHandlers,
	...ticketsHandlers,
	...todosHandlers,
];
