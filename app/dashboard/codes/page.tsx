import { lusitana } from "@/components/shared/fonts";
import { Metadata } from "next";
import React, { Suspense } from "react";
import { CategoriesTableSkeleton } from '@/components/shared/skeletons'
import CreateCode from "@/components/shared/codes/CreateCode";
import CodesTable from "@/components/shared/codes/table";
import Pagination from "@/components/shared/categories/Pagination";
import { fetchQRCodes, fetchQRCodesPages, markQRCodesAsCopied } from "@/lib/actions/qrCodeActions";
import { fetchFilteredBooks } from "@/lib/actions/bookActions";


export const metadata: Metadata = {
  title: "codes",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{  query?: string;
      page?: number }>;
}) {

  const query = (await searchParams).query ;
  const currentPage = (await searchParams).page || 1
  const params = query || null;
  const totalPages = await fetchQRCodesPages(params);
const codes = await fetchQRCodes(params ,currentPage );
const books = await fetchFilteredBooks(null,currentPage);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Codes</h1>
      </div>
      <CreateCode books={books} />
      
      <Suspense key={"" + currentPage} fallback={<CategoriesTableSkeleton />}>
        <CodesTable
          codes={codes}
          onUpdateStatus={async (selectedIds) => {
            'use server';
            await markQRCodesAsCopied(selectedIds);
          }}
        />
      </Suspense>
      
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}