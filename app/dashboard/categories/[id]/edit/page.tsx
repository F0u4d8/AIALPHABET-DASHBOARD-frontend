
import Breadcrumbs from '@/components/shared/categories/breadcrumbs'
import EditCategiryForm from '@/components/shared/categories/editCategory'
import { fetchCategoryById } from '@/lib/actions/categoriesActions'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Edit Category',
}

export default async function Page ( { params }: { params: Promise<{ id: string }>   }) {
  const id = (await params).id;
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
          { label: 'Categories', href: '/dashboard/categories' },
          {
            label: 'Edit Category',
            href: `/dashboard/categories/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditCategiryForm category={category}  />
    </main>
  )
}