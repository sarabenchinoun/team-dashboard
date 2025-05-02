import { cn } from "@/lib/utils";
import {
	Check,
	CircleHelp,
	House,
	ListTodo,
	LoaderCircle,
	type LucideProps,
	Pen,
	Plus,
	Ticket,
	Trash2,
	TriangleAlert,
	Users,
	X,
} from "lucide-react";

const Icons = {
	house: House,
	users: Users,
	"circle-help": CircleHelp,
	ticket: Ticket,
	"list-todo": ListTodo,
	"loader-circle": LoaderCircle,
	"triangle-alert": TriangleAlert,
	check: Check,
	plus: Plus,
	pen: Pen,
	trash: Trash2,
	x: X,
};
export interface IconProps extends LucideProps {
	name: keyof typeof Icons;
}

export function Icon({ name, className, ...props }: IconProps) {
	const Component = Icons[name];
	return <Component className={cn("shrink-0", className)} {...props} />;
}
