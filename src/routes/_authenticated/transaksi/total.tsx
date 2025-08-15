import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/transaksi/total')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/transaksi/total"!</div>
}
