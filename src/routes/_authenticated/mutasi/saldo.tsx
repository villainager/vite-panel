import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/mutasi/saldo')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/mutasi/saldo"!</div>
}
