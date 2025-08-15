import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/downline/list')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/downline/list"!</div>
}
