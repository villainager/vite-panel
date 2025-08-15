import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/cetak-struk')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/cetak-struk"!</div>
}
