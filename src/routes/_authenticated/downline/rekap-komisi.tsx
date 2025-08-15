import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/downline/rekap-komisi')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/downline/rekap-komisi"!</div>
}
