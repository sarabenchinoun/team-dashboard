import { Icon, type IconProps } from "@/components/icon";
import { Separator } from "@/components/ui/separator";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { navigationItems } from "@/lib/config";
import type { QueryClient } from "@tanstack/react-query";
import {
	Link,
	Outlet,
	createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient;
}>()({
	component: () => (
		<>
			<SidebarProvider>
				<Sidebar collapsible="icon" variant="inset">
					<SidebarHeader>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton size="lg" asChild>
									<Link to="/">
										<img src="/favicon.png" alt="Logo" className=" h-8 w-8" />
										<div className=" flex-1 text-left text-lg leading-tight">
											<span className="truncate font-semibold">Media</span>
										</div>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarHeader>
					<SidebarContent>
						<SidebarGroup>
							<SidebarGroupContent>
								<SidebarMenu>
									{navigationItems.map((item) => (
										<SidebarMenuItem key={item.title}>
											<SidebarMenuButton asChild tooltip={item.title}>
												<Link to={item.url}>
													<Icon name={item.icon as IconProps["name"]} />
													<span>{item.title}</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
									))}
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
					</SidebarContent>
				</Sidebar>
				<SidebarInset>
					<header className="flex h-16 shrink-0 items-center gap-2 border-b">
						<div className="flex items-center gap-2 px-3">
							<SidebarTrigger />
							<Separator orientation="vertical" className="mr-2 h-4" />
						</div>
					</header>
					<div className="flex-1 p-4">
						<Outlet />
						<TanStackRouterDevtools position="bottom-right" />
					</div>
				</SidebarInset>
			</SidebarProvider>
		</>
	),
});
