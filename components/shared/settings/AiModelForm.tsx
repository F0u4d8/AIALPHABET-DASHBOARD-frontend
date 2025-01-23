"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateAiModel } from "@/lib/actions/aiModelActions";
import { AiModel } from "@prisma/client";
import Form from "next/form";
import { useActionState } from "react";

export default function AiModelForm({
  existingModel,
}: {
  existingModel: AiModel | null;
}) {
  const [errorMessage, formAction] = useActionState(updateAiModel, undefined);

  return (
    <Form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="name">Model Name</Label>
        <Input
          id="name"
          name="name"
          defaultValue={existingModel?.name || ""}
          placeholder="gpt-4-turbo"
        />
      </div>

      <div>
        <Label htmlFor="apiKey">API Key</Label>
        <Input
          id="apiKey"
          name="apiKey"
          type="password"
          defaultValue={existingModel?.apiKey || ""}
          placeholder="sk-..."
        />
      </div>

      {errorMessage && (
        <p className="text-sm text-red-500">{errorMessage.message}</p>
      )}

      <Button type="submit">
        {existingModel ? "Update" : "Create"} AI Model
      </Button>
    </Form>
  );
}
