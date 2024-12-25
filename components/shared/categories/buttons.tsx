import { Button } from '@/components/ui/button'
import { deleteCategory } from '@/lib/actions/categoriesActions'
import { PencilIcon, TrashIcon } from 'lucide-react'
import Form from 'next/form'
import Link from 'next/link'

export function UpdateCategory({ id }: { id: string }) {
  return (
    <Button variant="outline" asChild>
      <Link href={`/dashboard/categories/${id}/edit`}>
        <PencilIcon className="w-5" />
      </Link>
    </Button>
  )
}

export function DeleteCategory({ id }: { id: string }) {
  const deleteCategoryWithId = deleteCategory.bind(null, id)

  return (
    <Form action={deleteCategoryWithId}>
      <Button variant="outline" type="submit">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </Button>
    </Form>
  )
}