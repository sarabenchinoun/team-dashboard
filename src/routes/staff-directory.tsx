import { useQuery } from "@tanstack/react-query";
import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import {
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";

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
import { formatDate } from "@/lib/helpers";
import { PageParams, defaultPageParams } from "@/lib/pagination";
import { membersQuery } from "@/lib/queries/staff";
import type { Member } from "@/mock-db/staff-member";

export const Route = createFileRoute("/staff-directory")({
	validateSearch: PageParams,
	search: {
		middlewares: [stripSearchParams(defaultPageParams)],
	},
	beforeLoad: ({ context }) => {
		context.queryClient.ensureQueryData(membersQuery());
	},
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="p-2">
			<h1 className="font-bold text-2xl">Staff Directory</h1>
			<div className="py-6">
				<StaffTable />
			</div>
		</div>
	);
}

export const staffColumns: ColumnDef<Member>[] = [
	{
		accessorKey: "name",
		header: "Name",
		cell: ({ row }) => {
			const { name, email } = row.original;
			return (
				<div>
					<div className="font-medium">{name}</div>
					<div className="text-muted-foreground text-xs">{email}</div>
				</div>
			);
		},
	},
	{
		accessorKey: "role",
		header: "Role",
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => {
			const { status } = row.original;
			return (
				<Badge variant={status ? "success" : "destructive"}>
					{status ? "Active" : "Inactive"}
				</Badge>
			);
		},
	},

	{
		id: "device_drive",
		header: "Device / Usage",
		cell: ({ row }) => {
			const { device, drive_usage } = row.original;
			return (
				<div>
					<div>{device}</div>
					<div className="text-muted-foreground text-xs">{drive_usage}</div>
				</div>
			);
		},
	},
	{
		accessorKey: "last_login",
		header: "Last Login",
		cell: ({ row }) => {
			const { last_login } = row.original;
			return formatDate(last_login);
		},
	},
];

export function StaffTable() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate(); // Get the current search params so we can navigate with them

	const { data, isPending } = useQuery(membersQuery(search));

	const paginationState = {
		pageIndex: search.pageIndex ?? 0,
		pageSize: search.pageSize ?? 10,
	};
	const pageCount = Math.ceil(
		(data?.metadata.total_records ?? 0) / (paginationState?.pageSize ?? 10),
	);

	const table = useReactTable({
		data: data?.staff ?? [],
		columns: staffColumns,
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
									{staffColumns.map((_, j) => (
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
									colSpan={staffColumns.length}
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
