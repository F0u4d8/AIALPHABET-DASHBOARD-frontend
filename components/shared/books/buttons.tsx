import { Button } from '@/components/ui/button'
import { deleteBook } from '@/lib/actions/bookActions'
import { Pencil, QrCode, Trash, TrashIcon } from 'lucide-react'
import Form from 'next/form'
import Link from 'next/link'

export function UpdateBook({ id }: { id: string }) {
  return (
    <Button variant="outline" size="sm" className="px-2" asChild>
      <Link href={`/dashboard/books/${id}/edit`}>
      <Pencil className="w-4 h-4" />
      </Link>
    </Button>
  )
}

export function DeleteBook({ id }: { id: string }) {
  const deleteBookWithId = deleteBook.bind(null, id)

  return (
    <Form action={deleteBookWithId}>
      <Button variant="destructive" size="sm" className="px-2" type="submit">
      <Trash className="w-4 h-4" />
      </Button>
    </Form>
  )
}


export function BookQR({ bookName }: { bookName: string }) {
    return (
      <Button variant="outline" size="sm" className="flex-1" asChild>
        <Link href={`/dashboard/codes?query=${bookName}`}>
        <QrCode className="w-4 h-4 mr-1" />
        QR
        </Link>
      </Button>
    )
  }