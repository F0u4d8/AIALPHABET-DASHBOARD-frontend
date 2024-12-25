
import Breadcrumbs from '@/components/shared/categories/breadcrumbs'
import EditCategiryForm from '@/components/shared/categories/editCategory'
import { fetchCategoryById } from '@/lib/actions/categoriesActions'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Edit Category',
}

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id
  const [category] = await Promise.all([
    fetchCategoryById(id)
  ])

  if (!category) {
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
      <EditCategiryForm category={category}  />
    </main>
  )
}