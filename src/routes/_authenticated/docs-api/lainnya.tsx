import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/docs-api/lainnya')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/docs-api/lainnya"!</div>
}
