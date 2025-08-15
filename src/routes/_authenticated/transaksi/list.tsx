import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/transaksi/list')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/transaksi/list"!</div>
}
