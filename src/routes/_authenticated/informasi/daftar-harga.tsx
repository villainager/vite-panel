import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/informasi/daftar-harga')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/informasi/daftar-harga"!</div>
}
