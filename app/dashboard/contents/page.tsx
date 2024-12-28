import { lusitana } from "@/components/shared/fonts";
import Search from "@/components/shared/search";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import React, { Suspense } from "react";
import { CategoriesTableSkeleton } from '@/components/shared/skeletons'
import Pagination from "@/components/shared/categories/Pagination";
import { fetchContentsPages } from "@/lib/actions/contentsActions";
import ContentsTable from "@/components/shared/contents/table";


export const metadata: Metadata = {
  title: "Contents",
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


  const totalPages = await fetchContentsPages(params)
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Contents</h1>
      </div>
<div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
<Search href="contents" placeholder="Search contents ..." query={query} />
        <Button asChild>
          <Link href="/dashboard/contents/create">
            <span className="hidden md:block">Create Content</span>
            <PlusIcon className="h-5 md:ml-4" />
          </Link>
        </Button>
        </div>
        <Suspense key={query || "" + currentPage} fallback={<CategoriesTableSkeleton />}>
        <ContentsTable query={params} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
