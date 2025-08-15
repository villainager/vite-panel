import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/downline/total-transaksi',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/downline/total-transaksi"!</div>
}
