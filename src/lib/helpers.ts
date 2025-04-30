export function formatDate(date: string) {
	return Intl.DateTimeFormat("en-GB", {
		year: "numeric",
		month: "2-digit",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(new Date(date));
}
