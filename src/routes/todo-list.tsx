import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/todo-list')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/todo-list"!</div>
}
