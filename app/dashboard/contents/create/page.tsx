import { auth } from '@/auth'
import { redirect } from "next/navigation";
import { Metadata } from 'next'
import Breadcrumbs from '@/components/shared/categories/breadcrumbs';
import CreateContentForm from '@/components/shared/contents/CreateContentForm';
import { fetchCategories } from '@/lib/actions/categoriesActions';


export const metadata: Metadata = {
  title: 'Create Category',
}

export default async function Page() {
    const session = await auth();

    if (!session) redirect("/");

const categories = await fetchCategories();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Contents', href: '/dashboard/contents' },
          {
            label: 'Create Content',
            href: '/dashboard/contents/create',
            active: true,
          },
        ]}
      />
  <CreateContentForm categories={categories} />
    </main>
  )
}