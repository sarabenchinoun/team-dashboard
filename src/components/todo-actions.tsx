import { type AnyFieldApi, useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import { toast } from "sonner";

import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	CreateTodo,
	deleteTodo,
	postTodo,
	todosQuery,
	updateTodo,
} from "@/lib/queries/todos";
import { cn } from "@/lib/utils";
import type { Todo } from "@/mock-db/todo";
import { Checkbox } from "./ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";

function AddTodo() {
	const [isOpen, setIsOpen] = React.useState(false);
	const queryClient = useQueryClient();

	const { mutate, isPending, isError, error } = useMutation({
		mutationFn: postTodo,
		onSuccess: async () => {
			await queryClient.invalidateQueries(todosQuery());
			handleClose(false);
			toast("Todo created successfully", {
				description: "Your todo has been created successfully.",
			});
		},
	});

	const form = useForm({
		defaultValues: {
			title: "",
			completed: false,
		},
		onSubmit: ({ value }) => {
			mutate(value);
		},
	});

	function handleClose(value: boolean) {
		setIsOpen(value);
		form.reset();
	}

	return (
		<Dialog open={isOpen} onOpenChange={(e) => setIsOpen(e)}>
			<DialogTrigger asChild>
				<Button className="w-fit" size="sm" onClick={() => setIsOpen(true)}>
					<Icon name="plus" />
					Add Todo
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Add new todo</DialogTitle>
					<DialogDescription>
						Fill in the details of the new todo item you want to add.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4">
					{isPending && (
						<div className="mt-2 flex items-center gap-2">
							<Icon name="loader-circle" className="animate-spin" size={16} />
							<span>Submitting...</span>
						</div>
					)}
					<div>
						<form
							onSubmit={(event) => {
								event.preventDefault();
								event.stopPropagation();
								void form.handleSubmit();
							}}
						>
							<div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
								<form.Field
									name="title"
									validators={{
										onChange: CreateTodo.shape.title,
									}}
								>
									{(field) => {
										return (
											<div className="sm:col-span-6">
												<label
													htmlFor={field.name}
													className="block font-medium text-gray-900 text-sm/6"
												>
													Title
												</label>
												<Input
													placeholder="Fix the wifi issue for Sami's Macbook"
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
									name="completed"
									validators={{
										onChange: CreateTodo.shape.completed,
									}}
								>
									{(field) => {
										return (
											<div className="flex items-center gap-x-2 sm:col-span-6">
												<label
													htmlFor={field.name}
													className="block font-medium text-gray-900 text-sm/6"
												>
													Completed
												</label>
												<Checkbox
													id={field.name}
													checked={field.state.value}
													onCheckedChange={(checked) => {
														field.handleChange(!!checked);
													}}
												/>

												<FieldInfo field={field} />
											</div>
										);
									}}
								</form.Field>
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
			</DialogContent>
		</Dialog>
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

function DeleteTodo({ todoId }: { todoId: number }) {
	const [isOpen, setIsOpen] = React.useState(false);

	const queryClient = useQueryClient();

	const { mutate, isPending, isError, error } = useMutation({
		mutationFn: () => deleteTodo(todoId),
		onSuccess: async () => {
			await queryClient.invalidateQueries(todosQuery());
			setIsOpen(false);
			toast("Todo deleted successfully", {
				description: "Your todo has been deleted successfully.",
			});
		},
	});

	return (
		<Dialog open={isOpen} onOpenChange={(e) => setIsOpen(e)}>
			<DialogTrigger asChild>
				<Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
					<Icon name="trash" />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Delete todo</DialogTitle>
					<DialogDescription>
						Are you sure you want to delete this todo? This action cannot be
						undone.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4">
					{isPending && (
						<div className="mt-2 flex items-center gap-2">
							<Icon name="loader-circle" className="animate-spin" size={16} />
							<span>Submitting...</span>
						</div>
					)}
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
					<Button
						onClick={() => {
							mutate();
						}}
					>
						Delete
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

function TodoItem({
	id,
	title,
	completed,
}: Pick<Todo, "id" | "title" | "completed">) {
	const [editing, setEditing] = React.useState(false);
	const [local, setLocal] = React.useState({ title, completed });
	const queryClient = useQueryClient();
	const { mutate, isPending } = useMutation({
		mutationFn: (body: Partial<Todo>) => updateTodo(id, body),
		onSuccess: async () => {
			await queryClient.invalidateQueries(todosQuery());
			setEditing(false);
		},
	});

	return (
		<div className="flex items-center justify-between gap-x-2 border-b">
			<div className="flex min-w-0 flex-1 items-center space-x-2 py-4">
				<Checkbox
					id={`todo-${id}`}
					checked={local.completed}
					onCheckedChange={(checked) => {
						setLocal((l) => ({ ...l, completed: !!checked }));
						if (!editing) mutate({ completed: !!checked });
					}}
					disabled={isPending}
				/>
				{editing ? (
					<Input
						id={`todo-${id}`}
						value={local.title}
						onChange={(e) => setLocal((l) => ({ ...l, title: e.target.value }))}
						disabled={isPending}
						className="min-w-[120px] max-w-full flex-1 font-medium text-sm leading-none"
					/>
				) : (
					<label
						htmlFor={`todo-${id}`}
						className={cn(
							"font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
							!local.completed && "text-muted-foreground line-through",
						)}
					>
						{title}
					</label>
				)}
			</div>
			<div className="flex items-center gap-x-1">
				<Button
					variant="ghost"
					size="icon"
					className="p-2"
					onClick={() => {
						if (editing) mutate({ ...local });
						else setEditing(true);
					}}
					disabled={isPending}
				>
					<Icon name={editing ? "check" : "pen"} />
				</Button>
				{editing && (
					<Button
						variant="ghost"
						size="icon"
						className="p-2"
						onClick={() => {
							setEditing(false);
							setLocal({ title, completed });
						}}
						disabled={isPending}
					>
						<Icon name="x" />
					</Button>
				)}
				<DeleteTodo todoId={id} />
			</div>
		</div>
	);
}

export { AddTodo, DeleteTodo, TodoItem };
