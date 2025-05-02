import { useQuery } from "@tanstack/react-query";
import { createFileRoute, stripSearchParams } from "@tanstack/react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { PageParams, defaultPageParams } from "@/lib/pagination";
import { ticketsQuery } from "@/lib/queries/tickets";
import { type Ticket, issuetypes, ticketStatuses } from "@/mock-db/ticket";
import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";

export const Route = createFileRoute("/tickets")({
	validateSearch: PageParams,
	search: {
		middlewares: [stripSearchParams(defaultPageParams)],
	},
	beforeLoad: ({ context }) => {
		context.queryClient.ensureQueryData(ticketsQuery());
	},
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="p-2">
			<h1 className="font-bold text-2xl">Tickets</h1>
			<div className="py-6">
				<TicketsTable />
			</div>
		</div>
	);
}

export const ticketsColumns: ColumnDef<Ticket>[] = [
	{
		id: "user_issue",
		header: "User / Issue",
		cell: ({ row }) => {
			const { user, issue } = row.original;
			const issueTypeMap = Object.fromEntries(
				issuetypes.map((i) => [i.value, i.label]),
			);

			return (
				<div>
					<div className="font-medium">{issueTypeMap[issue] ?? issue}</div>
					<div className="text-muted-foreground text-xs">{user}</div>
				</div>
			);
		},
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => {
			const { status } = row.original;
			const statusVariant =
				status === "open"
					? "success"
					: status === "pending"
						? "warning"
						: "secondary";

			const statusMap = Object.fromEntries(
				ticketStatuses.map((s) => [s.value, s.label]),
			);
			return (
				<Badge variant={statusVariant}>{statusMap[status] ?? status}</Badge>
			);
		},
	},
	{
		accessorKey: "description",
		header: "Description",
		cell: ({ row }) => {
			const { description } = row.original;
			const truncated =
				description.length > 60 ? `${description.slice(0, 60)}…` : description;
			return description.length > 60 ? (
				<Tooltip>
					<TooltipTrigger asChild>
						<span className="cursor-pointer underline decoration-dotted">
							{truncated}
						</span>
					</TooltipTrigger>
					<TooltipContent className="w-44 md:w-full">
						{description}
					</TooltipContent>
				</Tooltip>
			) : (
				<span>{description}</span>
			);
		},
	},
	{
		accessorKey: "file",
		header: "File Name",
		cell: ({ row }) => {
			const { file } = row.original;
			const truncated =
				file && file.length > 20 ? `${file.slice(0, 20)}…` : file;
			return <span>{truncated}</span>;
		},
	},
];

export function TicketsTable() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate(); // Get the current search params so we can navigate with them

	const { data, isPending } = useQuery(ticketsQuery(search));

	const paginationState = {
		pageIndex: search.pageIndex ?? 0,
		pageSize: search.pageSize ?? 10,
	};
	const pageCount = Math.ceil(
		(data?.metadata.total_records ?? 0) / (paginationState?.pageSize ?? 10),
	);

	const table = useReactTable({
		data: data?.tickets ?? [],
		columns: ticketsColumns,
		getCoreRowModel: getCoreRowModel(),
		onPaginationChange: (pagination) => {
			const pages =
				typeof pagination === "function"
					? pagination(paginationState)
					: pagination;

			navigate({
				search: (prevSearch) => ({
					...prevSearch,
					...pages,
				}),
			});
		},
		manualPagination: true, // Enable manual pagination because we are using server-side data
		pageCount,
	});

	return (
		<>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{isPending ? (
							Array.from({ length: 6 }).map((_, i) => (
								<TableRow key={`skeleton-${i}`}>
									{ticketsColumns.map((_, j) => (
										<TableCell key={j}>
											<Skeleton className="h-4 w-full" />
										</TableCell>
									))}
								</TableRow>
							))
						) : table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={ticketsColumns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.previousPage()}
					disabled={paginationState.pageIndex === 0}
				>
					Previous
				</Button>
				<div>
					{paginationState.pageIndex + 1} / {table.getPageCount()}
				</div>
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.nextPage()}
					disabled={paginationState.pageIndex >= pageCount - 1}
				>
					Next
				</Button>
			</div>
		</>
	);
}
