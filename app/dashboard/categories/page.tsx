import { lusitana } from "@/components/shared/fonts";
import Search from "@/components/shared/search";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import React, { Suspense } from "react";
import { CategoriesTableSkeleton } from '@/components/shared/skeletons'
import Pagination from "@/components/shared/categories/Pagination";
import CategoriesTable from "@/components/shared/categories/table";
import { fetchCategoriesPages } from "@/lib/actions/categoriesActions";

export const metadata: Metadata = {
  title: "Categories",
};

export default async function Page({
    searchParams,
  }: {
    searchParams: Promise<{  query?: string;
        page?: number }>;
  } ) {



    const query = (await searchParams).query ;
    const currentPage = (await searchParams).page || 1
    const params = query || null;


  const totalPages = await fetchCategoriesPages(params)
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Categories</h1>
      </div>
<div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
<Search href="categories" placeholder="Search categories..." query={query} />
        <Button asChild>
          <Link href="/dashboard/categories/create">
            <span className="hidden md:block">Create Category</span>
            <PlusIcon className="h-5 md:ml-4" />
          </Link>
        </Button>
        </div>
        <Suspense key={query || "" + currentPage} fallback={<CategoriesTableSkeleton />}>
        <CategoriesTable query={params} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
