import { lusitana } from "@/components/shared/fonts";
import AiModelForm from "@/components/shared/settings/AiModelForm";
import { fetchAiModel } from "@/lib/actions/aiModelActions";
import { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "AI Settings",
};

export default async function Page() {
  const model = await fetchAiModel();

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>AI Model Settings</h1>
      </div>
      <div className="mt-4 max-w-md">
        <AiModelForm existingModel={model} />
      </div>
    </div>
  );
}
