import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/docs-api/documentation')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/docs-api/documentation"!</div>
}
