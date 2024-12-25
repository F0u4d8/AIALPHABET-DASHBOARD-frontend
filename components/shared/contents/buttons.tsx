import { Button } from '@/components/ui/button'
import { deleteContent } from '@/lib/actions/contentsActions'
import { PencilIcon, TrashIcon } from 'lucide-react'
import Form from 'next/form'
import Link from 'next/link'

export function UpdateContent({ id }: { id: string }) {
  return (
    <Button variant="outline" asChild>
      <Link href={`/dashboard/contents/${id}/edit`}>
        <PencilIcon className="w-5" />
      </Link>
    </Button>
  )
}

export function DeleteContent({ id }: { id: string }) {
  const deleteContentWithId = deleteContent.bind(null, id)

  return (
    <Form action={deleteContentWithId}>
      <Button variant="outline" type="submit">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </Button>
    </Form>
  )
}