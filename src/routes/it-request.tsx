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
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/it-request")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = Route.useNavigate();
	// Tanstack has a weird issue with handling files
	const [fileUpload, setFileUpload] = useState<File | null>(null);

	const { mutate, isPending, isError, error } = useMutation({
		mutationFn: postTicket,
		onSuccess: async () => {
			form.reset();
			toast("Ticket created successfully", {
				description: "Your ticket has been created successfully.",
			});
			await navigate({
				to: "/tickets",
				replace: true,
			});
		},
	});

	const form = useForm({
		defaultValues: {
			user: "",
			issue: "",
			description: "",
			status: "",
			file: null,
		},
		onSubmit: ({ value }) => {
			const formData = new FormData();
			formData.append("user", value.user);
			formData.append("issue", value.issue);
			formData.append("description", value.description);
			formData.append("status", value.status);
			if (fileUpload) {
				formData.append("file", fileUpload);
			}
			mutate(formData);
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
					encType="multipart/form-data"
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

						<div className="sm:col-span-3">
							<label
								htmlFor="file-upload"
								className="block font-medium text-gray-900 text-sm/6"
							>
								File
							</label>
							<div className="mt-2">
								<Input
									type="file"
									id="file-upload"
									name="file"
									onChange={(e) => {
										const file = e.target.files?.[0];
										if (!file) {
											return;
										}
										setFileUpload(file);
									}}
								/>
							</div>
						</div>
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
				<div className="mt-2 text-destructive">
					{field.state.meta.errors[0].message}
				</div>
			) : null}
			{field.state.meta.isValidating ? "Validating..." : null}
		</>
	);
}
