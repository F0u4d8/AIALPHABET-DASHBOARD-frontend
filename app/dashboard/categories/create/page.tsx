import { auth } from '@/auth'
import { redirect } from "next/navigation";
import { Metadata } from 'next'
import Breadcrumbs from '@/components/shared/categories/breadcrumbs';

import CreateCategoryForm from '@/components/shared/categories/CreateCategoryForm';

export const metadata: Metadata = {
  title: 'Create Invoice',
}

export default async function Page() {
    const session = await auth();

    if (!session) redirect("/");
   
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'categories', href: '/dashboard/categories' },
          {
            label: 'Create category',
            href: '/dashboard/categories/create',
            active: true,
          },
        ]}
      />
  <CreateCategoryForm />
    </main>
  )
}