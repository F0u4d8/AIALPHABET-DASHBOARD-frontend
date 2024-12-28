
import Breadcrumbs from '@/components/shared/categories/breadcrumbs'
import EditContentForm from '@/components/shared/contents/editContent'
import { fetchCategories } from '@/lib/actions/categoriesActions'
import { fetchContentById } from '@/lib/actions/contentsActions'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Edit Content',
}

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id
  const [content , categories] = await Promise.all([
    fetchContentById(id),fetchCategories()
  ])

  if (!content) {
    notFound()
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditContentForm content={content} categories={categories}  />
    </main>
  )
}