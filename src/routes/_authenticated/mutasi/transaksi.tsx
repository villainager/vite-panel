import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/mutasi/transaksi')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/mutasi/transaksi"!</div>
}
