import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	ErrorComponent,
	RouterProvider,
	createRouter,
} from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

import "./tailwind.css";
import { Icon } from "./components/icon";
import { seed } from "./mock-db/seed";

const queryClient = new QueryClient();

// Create a new router instance
const router = createRouter({
	routeTree,
	context: {
		queryClient,
	},
	defaultPreload: "intent",
	// Since we're using React Query, we don't want loader calls to ever be stale
	// This will ensure that the loader is always called when the route is preloaded or visited
	defaultPreloadStaleTime: 0,
	scrollRestoration: true,
	defaultNotFoundComponent: () => (
		<div className="grid h-svh w-full place-items-center">
			<h1>Not Found</h1>
		</div>
	),
	defaultErrorComponent: ({ error }) => {
		return <ErrorComponent error={error} />;
	},
	defaultPendingComponent: () => (
		<div className="grid h-svh w-full place-items-center">
			<Icon name="loader-circle" className="size-8 animate-spin" />
		</div>
	),
});

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
				<QueryClientProvider client={queryClient}>
					<RouterProvider router={router} />
				</QueryClientProvider>
			</StrictMode>,
		);
	});
}
