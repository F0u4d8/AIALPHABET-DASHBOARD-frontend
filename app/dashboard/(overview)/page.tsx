import StatCardsWrapper from "@/components/shared/dashboard/StatCardsWrapper";
import { lusitana } from "@/components/shared/fonts";
import { CardsSkeleton } from "@/components/shared/skeletons";
import { Suspense } from "react";

export default async function Page() {
    return (
      <main>
        <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
          Dashboard
        </h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <StatCardsWrapper />
        </Suspense>
      </div>
       
      </main>
    )
  }