import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);

export function mockApi(path: string) {
	return `http://localhost:3000/api/v1${path}`;
}
