import { type AnyFieldApi, useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CreateTicket, postTicket } from "@/lib/queries/tickets";
import { issuetypes, ticketStatuses } from "@/mock-db/ticket";
import { toast } from "sonner";

export const Route = createFileRoute("/it-request")({
	component: RouteComponent,
});

function RouteComponent() {
	const { mutate, isPending, isError, error } = useMutation({
		mutationFn: postTicket,
		meta: {
			invalidates: ["tickets"],
		},
		onSuccess: () => {
			form.reset();
			toast("Ticket created successfully", {
				description: "Your ticket has been created successfully.",
			});
		},
	});

	const form = useForm({
		defaultValues: {
			user: "",
			issue: "",
			description: "",
			status: "",
		},
		onSubmit: ({ value }) => {
			mutate(value);
		},
	});

	return (
		<div className="w-full max-w-xl p-2">
			<h2 className="font-semibold text-base/7 text-gray-900">
				IT Request Form
			</h2>
			<p className="mt-1 text-gray-600 text-sm/6">
				Please fill out the form below to submit your IT request. We will get
				back to you as soon as possible.
			</p>
			{isPending && (
				<div className="mt-2 flex items-center gap-2">
					<Icon name="loader-circle" className="animate-spin" size={16} />
					<span>Submitting...</span>
				</div>
			)}
			<div className="mt-4">
				<form
					onSubmit={(event) => {
						event.preventDefault();
						event.stopPropagation();
						void form.handleSubmit();
					}}
				>
					<div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
						<form.Field
							name="user"
							validators={{
								onChange: CreateTicket.shape.user,
							}}
						>
							{(field) => {
								return (
									<div className="sm:col-span-3">
										<label
											htmlFor={field.name}
											className="block font-medium text-gray-900 text-sm/6"
										>
											User Email
										</label>
										<Input
											placeholder="example@brrmedia.com"
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(event) =>
												field.handleChange(event.target.value)
											}
											className="mt-2"
										/>

										<FieldInfo field={field} />
									</div>
								);
							}}
						</form.Field>
						<form.Field
							name="issue"
							validators={{ onChange: CreateTicket.shape.issue }}
						>
							{(field) => {
								return (
									<div className="sm:col-span-4">
										<label
											htmlFor={field.name}
											className="block font-medium text-gray-900 text-sm/6"
										>
											Issue Type
										</label>
										<div className="mt-2">
											<Select
												onValueChange={(value) => {
													field.handleChange(value);
												}}
												defaultValue={field.state.value}
												name={field.name}
											>
												<SelectTrigger className="w-[180px]">
													<SelectValue placeholder="Select an issue type" />
												</SelectTrigger>
												<SelectContent>
													<SelectGroup>
														{issuetypes.map((issue) => (
															<SelectItem key={issue.value} value={issue.value}>
																{issue.label}
															</SelectItem>
														))}
													</SelectGroup>
												</SelectContent>
											</Select>
										</div>

										<FieldInfo field={field} />
									</div>
								);
							}}
						</form.Field>
						<form.Field
							name="description"
							validators={{ onChange: CreateTicket.shape.description }}
						>
							{(field) => {
								return (
									<div className="sm:col-span-6">
										<label
											htmlFor={field.name}
											className="block font-medium text-gray-900 text-sm/6"
										>
											Description
										</label>
										<Textarea
											placeholder="My Macbook is not connecting to the wifi"
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(event) =>
												field.handleChange(event.target.value)
											}
											className="mt-2"
										/>
										<FieldInfo field={field} />
									</div>
								);
							}}
						</form.Field>
						<form.Field
							name="status"
							validators={{ onChange: CreateTicket.shape.status }}
						>
							{(field) => {
								return (
									<div className="sm:col-span-4">
										<label
											htmlFor={field.name}
											className="block font-medium text-gray-900 text-sm/6"
										>
											Status
										</label>
										<div className="mt-2">
											<Select
												onValueChange={(value) => {
													field.handleChange(value);
												}}
												defaultValue={field.state.value}
												name={field.name}
											>
												<SelectTrigger className="w-[180px]">
													<SelectValue placeholder="Select a status" />
												</SelectTrigger>
												<SelectContent>
													<SelectGroup>
														{ticketStatuses.map((issue) => (
															<SelectItem key={issue.value} value={issue.value}>
																{issue.label}
															</SelectItem>
														))}
													</SelectGroup>
												</SelectContent>
											</Select>
										</div>
										<FieldInfo field={field} />
									</div>
								);
							}}
						</form.Field>
						{/* <form.Field
						name="file"
						validators={{ onChange: () => CreateTicket.shape.file }}
					>
						{(field) => {
							return (
								<div>
									<label htmlFor={field.name}>File</label>
									<Input
										type="file"
										id={field.name}
										name={field.name}
										onChange={(event) => {
											const file = event.target.files?.[0];
											if (file) {
												 field.handleChange(file);
											}
										}}
									/>
									<FieldInfo field={field} />
								</div>
							);
						}}
					</form.Field> */}
					</div>
					{isError && (
						<div className="flex items-center gap-2">
							<Icon
								name="triangle-alert"
								className="text-destructive"
								size={16}
							/>
							<div>{error.message}</div>
						</div>
					)}
					<div className="mt-6">
						<form.Subscribe
							selector={(state) => [state.canSubmit, state.isSubmitting]}
						>
							{([canSubmit, isSubmitting]) => (
								<Button disabled={!canSubmit} type="submit">
									{isSubmitting || isPending ? "Submitting..." : "Submit"}
								</Button>
							)}
						</form.Subscribe>
					</div>
				</form>
			</div>
		</div>
	);
}

function FieldInfo({ field }: { field: AnyFieldApi }) {
	return (
		<>
			{field.state.meta.isTouched && !field.state.meta.isValid ? (
				<em className="mt-2 text-destructive">
					{field.state.meta.errors[0].message}
				</em>
			) : null}
			{field.state.meta.isValidating ? "Validating..." : null}
		</>
	);
}
