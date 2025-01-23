"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useActionState, useState } from "react";
import { createQRCode } from "@/lib/actions/qrCodeActions";
import { Label } from "@/components/ui/label";
import Form from "next/form";
import { Book } from "@prisma/client";

export default function CreateCode({books} : {books : Partial<Book>[]}) {
  const [open, setOpen] = useState(false);


  const [errorMessage, formAction, isPending] = useActionState(
    createQRCode,
    undefined
  );



  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="my-4">إنشاء رمز QR جديد</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إنشاء رمز QR جديد</DialogTitle>
        </DialogHeader>
        <Form action={formAction} className="space-y-4">
          <div>
            <Label htmlFor="bookId">اختر الكتاب</Label>
            <Select name="bookId" required>
              <SelectTrigger>
                <SelectValue placeholder="اختر الكتاب" />
              </SelectTrigger>
              <SelectContent>
              {books.map((book) => (
                <SelectItem key={book.id} value={book.id}>
                  {book.title}
                </SelectItem>
              ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit">إنشاء</Button>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
