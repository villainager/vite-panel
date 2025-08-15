import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/downline/list-transaksi')(
  {
    component: RouteComponent,
  },
)

function RouteComponent() {
  return <div>Hello "/_authenticated/downline/list-transaksi"!</div>
}
