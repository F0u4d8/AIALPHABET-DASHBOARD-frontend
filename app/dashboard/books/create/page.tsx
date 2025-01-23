import { auth } from '@/auth'
import { redirect } from "next/navigation";
import { Metadata } from 'next'
import Breadcrumbs from '@/components/shared/categories/breadcrumbs';
import CreateContentForm from '@/components/shared/contents/CreateContentForm';
import { fetchCategories } from '@/lib/actions/categoriesActions';
import CreateBookForm from '@/components/shared/books/CreateBookForm';


export const metadata: Metadata = {
  title: 'Create Book',
}

export default async function Page() {
    const session = await auth();

    if (!session) redirect("/");

const categories = await fetchCategories();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Books', href: '/dashboard/books' },
          {
            label: 'Create Books',
            href: '/dashboard/books/create',
            active: true,
          },
        ]}
      />
  <CreateBookForm  />
    </main>
  )
}