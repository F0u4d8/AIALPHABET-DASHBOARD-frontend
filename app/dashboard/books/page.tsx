import { lusitana } from "@/components/shared/fonts";
import { Metadata } from "next";
import React, { Suspense } from "react";
import { CategoriesTableSkeleton } from "@/components/shared/skeletons";
import BooksTable from "@/components/shared/books/table";
import { fetchBooksPages } from "@/lib/actions/bookActions";
import Search from "@/components/shared/search";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import Pagination from "@/components/shared/categories/Pagination";

export const metadata: Metadata = {
  title: "Books",
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

  const totalPages= await fetchBooksPages(params);

  return (

<div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Books</h1>
      </div>
<div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
<Search href="books" placeholder="Search books ..." query={query} />
        <Button asChild>
          <Link href="/dashboard/books/create">
            <span className="hidden md:block">Create Book</span>
            <PlusIcon className="h-5 md:ml-4" />
          </Link>
        </Button>
        </div>
        <Suspense key={query || "" + currentPage} fallback={<CategoriesTableSkeleton />}>
        <BooksTable query={params} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>



 
  );
}
