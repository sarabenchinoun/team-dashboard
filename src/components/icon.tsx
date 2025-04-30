import { cn } from "@/lib/utils";
import {
	CircleHelp,
	House,
	ListTodo,
	LoaderCircle,
	type LucideProps,
	Ticket,
	TriangleAlert,
	Users,
} from "lucide-react";

const Icons = {
	house: House,
	users: Users,
	"circle-help": CircleHelp,
	ticket: Ticket,
	"list-todo": ListTodo,
	"loader-circle": LoaderCircle,
	"triangle-alert": TriangleAlert,
};
export interface IconProps extends LucideProps {
	name: keyof typeof Icons;
}

export function Icon({ name, className, ...props }: IconProps) {
	const Component = Icons[name];
	return <Component className={cn("shrink-0", className)} {...props} />;
}
