import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/it-request')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/it-request"!</div>
}
