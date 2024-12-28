"use client";
import { Button } from "@/components/ui/button";
import { createQRCode } from "@/lib/actions/qrCodeActions";
import { PlusIcon } from "lucide-react";
import Form from "next/form";
import React, { useActionState } from "react";

const CreateCode = () => {
  const [errorMessage, formAction, isPending] = useActionState(
    createQRCode,
    undefined
  );
  return (
    <Form
      action={formAction}
      className="mt-4 flex items-center justify-end gap-2 md:mt-8"
    >
      <Button type="submit" >
        <div className="flex items-center">
          <span className="hidden md:block">Create a random code</span>
          <PlusIcon className="h-5 md:ml-4" />
        </div>
      </Button>
    </Form>
  );
};

export default CreateCode;
