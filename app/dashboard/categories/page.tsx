import { lusitana } from "@/components/shared/fonts";
import Search from "@/components/shared/search";
import { Button } from "@/components/ui/button";
import { fetchCategoriesPages } from "@/lib/actions/categoriesActions";
import { PlusIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import React, { Suspense } from "react";
import { InvoicesTableSkeleton } from '@/components/shared/skeletons'
import Pagination from "@/components/shared/categories/Pagination";
import InvoicesTable from "@/components/shared/categories/table";

export const metadata: Metadata = {
  title: "Categories",
};

export default async function Page({
    searchParams,
  }: {
    searchParams: Promise<{  query?: string;
        page?: string; }>;
  } ) {


    const resolvedSearchParams = await searchParams;

  const query = resolvedSearchParams?.query || "";
  const currentPage = Number(resolvedSearchParams?.page) || 1;
  const totalPages = await fetchCategoriesPages(query)
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
<div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
<Search href="/categories" placeholder="Search invoices..." query={query} />
        <Button asChild>
          <Link href="/dashboard/invoices/create">
            <span className="hidden md:block">Create Invoice</span>
            <PlusIcon className="h-5 md:ml-4" />
          </Link>
        </Button>
        </div>
        <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <InvoicesTable query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
