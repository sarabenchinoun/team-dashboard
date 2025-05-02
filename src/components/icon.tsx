import { cn } from "@/lib/utils";
import {
	Activity,
	Calendar,
	ChartBar,
	Check,
	CheckSquare,
	CircleHelp,
	Clock,
	House,
	ListTodo,
	LoaderCircle,
	type LucideProps,
	Pen,
	Plus,
	Ticket,
	Trash2,
	TriangleAlert,
	User2,
	UserCircle,
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
	"check-square": CheckSquare,
	plus: Plus,
	pen: Pen,
	trash: Trash2,
	x: X,
	"chart-bar": ChartBar,
	activity: Activity,
	clock: Clock,
	user: User2,
	calendar: Calendar,
	"user-circle": UserCircle,
};
export interface IconProps extends LucideProps {
	name: keyof typeof Icons;
}

export function Icon({ name, className, ...props }: IconProps) {
	const Component = Icons[name];
	return <Component className={cn("shrink-0", className)} {...props} />;
}
