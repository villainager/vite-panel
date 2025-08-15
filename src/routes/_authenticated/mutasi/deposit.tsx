import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/mutasi/deposit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/mutasi/deposit"!</div>
}
