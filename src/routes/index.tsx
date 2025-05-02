import { Icon } from "@/components/icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/helpers";
import { ticketsQuery } from "@/lib/queries/tickets";
import { todosQuery } from "@/lib/queries/todos";
import { issuetypes, ticketStatuses } from "@/mock-db/ticket";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	const { data: tickets_data, isLoading: ticketsLoading } = useQuery(
		ticketsQuery({ pageIndex: 0, pageSize: 100 }),
	);
	const { data: todos_data, isLoading: todosLoading } = useQuery(todosQuery());

	const tickets = tickets_data?.tickets;
	const todos = todos_data?.todos;

	const issueTypeMap = Object.fromEntries(
		issuetypes.map((i) => [i.value, i.label]),
	);
	const statusMap = Object.fromEntries(
		ticketStatuses.map((s) => [s.value, s.label]),
	);

	const openTickets = tickets?.filter((t) => t.status === "open").length ?? 0;
	const pendingTasks = todos?.filter((t) => !t.completed).length ?? 0;
	const completedTasks = todos?.filter((t) => t.completed).length ?? 0;
	const totalTasks = todos?.length ?? 0;
	const taskProgress = totalTasks
		? Math.round((completedTasks / totalTasks) * 100)
		: 0;
	const ticketTrend =
		tickets?.slice(0, 10).map((t) => (t.status === "open" ? 1 : 0)) ?? [];
	const lastPending = tickets?.find((t) => t.status === "pending");
	const user = "Mohamed"; // To be replaced with actual user data
	return (
		<div className="p-2">
			<div className="md:flex md:items-center md:justify-between">
				<div className="min-w-0 flex-1">
					<h2 className="font-bold text-2xl/7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
						Welcome {user}!
					</h2>
					<p className="mt-1 text-gray-500 text-sm">
						Here is a summary of your current tickets and tasks.
					</p>
				</div>
				<div className="mt-4 md:mt-0">
					<Button variant="ghost" size="sm" asChild>
						<a href="/it-request">
							<Icon name="plus" className="h-4 w-4" />
							New Ticket
						</a>
					</Button>
				</div>
			</div>
			<div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Icon name="ticket" className="text-primary" />
							Open Tickets
						</CardTitle>
						<CardDescription>Unresolved IT requests</CardDescription>
					</CardHeader>
					<CardContent>
						{ticketsLoading ? (
							<Skeleton className="h-10 w-24" />
						) : (
							<span className="font-bold text-4xl">{openTickets}</span>
						)}
						<Separator className="my-4" />
						<div className="flex items-center gap-2 text-muted-foreground text-xs">
							<Icon name="activity" className="h-4 w-4" />
							<span>Last 10 tickets trend:</span>
							<div className="flex gap-1">
								{ticketTrend.map((v, i) => (
									<span
										key={i}
										className={`inline-block h-2 w-2 rounded-full ${v ? "bg-primary" : "bg-muted"}`}
									/>
								))}
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Icon name="check-square" className="text-green-600" />
							Pending Tasks
						</CardTitle>
						<CardDescription>To-do items not completed</CardDescription>
					</CardHeader>
					<CardContent>
						{todosLoading ? (
							<Skeleton className="h-10 w-24" />
						) : (
							<span className="font-bold text-4xl">{pendingTasks}</span>
						)}
						<Separator className="my-4" />
						<Progress value={taskProgress} />
						<div className="mt-2 text-muted-foreground text-xs">
							{taskProgress}% complete ({completedTasks}/{totalTasks})
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Icon name="triangle-alert" className="text-warning" />
							Last Pending Ticket
						</CardTitle>
						<CardDescription>
							Most recent ticket with status "pending"
						</CardDescription>
					</CardHeader>
					<CardContent>
						{ticketsLoading ? (
							<Skeleton className="h-24 w-full" />
						) : lastPending ? (
							<div>
								<div className="flex items-center gap-2 font-semibold text-base">
									{issueTypeMap[lastPending.issue] || lastPending.issue}
									<Badge variant="warning">
										{statusMap[lastPending.status] || lastPending.status}
									</Badge>
								</div>
								<div className="mt-2 flex flex-col gap-2 text-muted-foreground text-xs">
									<div className="flex items-center gap-2">
										<Icon name="user" className="h-4 w-4" />
										{lastPending.user}
									</div>
									<div className="flex items-center gap-2">
										<Icon name="calendar" className="h-4 w-4" />
										{formatDate(lastPending.created_at)}
									</div>
								</div>
							</div>
						) : (
							<span className="text-muted-foreground">No pending tickets</span>
						)}
					</CardContent>
				</Card>
			</div>
			<Card className="mt-4">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Icon name="clock" className="text-blue-600" />
						Latest Updates
					</CardTitle>
					<CardDescription>Most recent 5 tickets</CardDescription>
				</CardHeader>
				<CardContent>
					{ticketsLoading ? (
						<Skeleton className="h-24 w-full" />
					) : tickets && tickets.length > 0 ? (
						<div className="flex flex-col gap-4">
							{tickets.slice(0, 5).map((ticket) => (
								<div
									key={ticket.id}
									className="border-b pb-2 last:border-b-0 last:pb-0"
								>
									<div className="flex items-center gap-2 font-semibold text-base">
										{issueTypeMap[ticket.issue] || ticket.issue}
										<Badge
											variant={
												ticket.status === "open"
													? "default"
													: ticket.status === "pending"
														? "secondary"
														: "outline"
											}
										>
											{statusMap[ticket.status] || ticket.status}
										</Badge>
									</div>
									<div className="mt-2 flex flex-col gap-2 text-muted-foreground text-xs sm:flex-row sm:items-center">
										<div className="flex items-center gap-2">
											<Icon name="user" className="h-4 w-4" />
											{ticket.user}
										</div>
										<div className="flex items-center gap-2">
											<Icon name="calendar" className="h-4 w-4" />
											{formatDate(ticket.created_at)}
										</div>
									</div>
								</div>
							))}
						</div>
					) : (
						<span className="text-muted-foreground">No recent updates</span>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
