
import EditBookForm from '@/components/shared/books/editBook'
import Breadcrumbs from '@/components/shared/categories/breadcrumbs'
import { fetchBookById } from '@/lib/actions/bookActions'

import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Edit Content',
}

export default async function Page({ params }: { params: Promise<{ id: string }>   }) {
  const id = (await params).id;

  const book = await fetchBookById(id)

  if (!book) {
    notFound()
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Books', href: '/dashboard/books' },
          {
            label: 'Edit Book',
            href: `/dashboard/books/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditBookForm book={book}   />
    </main>
  )
}