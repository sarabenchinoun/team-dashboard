import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";

import "./tailwind.css";
import { seed } from "./mock-db/seed";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

async function enableMocking() {
	const { worker } = await import("./mocks/browser");
	seed();

	// `worker.start()` returns a Promise that resolves
	// once the Service Worker is up and ready to intercept requests.
	return worker.start({
		onUnhandledRequest: "bypass",
	});
}

// Render the app
const rootElement = document.getElementById("root") as HTMLElement;
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	enableMocking().then(() => {
		root.render(
			<StrictMode>
				<RouterProvider router={router} />
			</StrictMode>,
		);
	});
}
