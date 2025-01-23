import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QrCode, Pencil, Trash } from "lucide-react";
import { Book, Permission } from "@prisma/client";
import { fetchFilteredBooks } from "@/lib/actions/bookActions";
import Image from "next/image";
import { BookQR, DeleteBook, UpdateBook } from "./buttons";

// وظيفة مساعدة لتحويل نوع التصريح إلى نص عربي
const getPermissionLabel = (permission: Permission) => {
  const labels = {
    CHAT: "chat",
    GOALS: "goals",
    READ: "read",
    FOCUS: "focus",
    ALL: "all",
  };
  return labels[permission] || permission;
};

// وظيفة مساعدة لتحديد لون البادج حسب نوع التصريح
const getPermissionColor = (permission: Permission) => {
  const colors = {
    CHAT: "bg-blue-500",
    GOALS: "bg-green-500",
    READ: "bg-yellow-500",
    FOCUS: "bg-purple-500",
    ALL: "bg-red-500",
  };
  return colors[permission] || "bg-gray-500";
};

export default async function BooksTable({
  query,
  currentPage,
}: {
  query: string | null;
  currentPage: number;
}) {
  const books = await fetchFilteredBooks(query, currentPage);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {books.map((book) => (
        <Card key={book.id} className="flex flex-col h-[400px]">
          <CardHeader className="flex-none p-4">
            <div className="space-y-2">
              <CardTitle className="text-lg line-clamp-1">
                {book.title}
              </CardTitle>
              <CardDescription className="line-clamp-2">
                <p
                  className="text-sm text-gray-500"
                  dangerouslySetInnerHTML={{
                    __html: book.description?.slice(0, 100) || "",
                  }}
                />
              </CardDescription>
              <div className="flex flex-wrap gap-1">
                {book.permission.map((perm) => (
                  <Badge
                    key={perm}
                    className={`${getPermissionColor(perm)} text-white text-xs`}
                  >
                    {getPermissionLabel(perm)}
                  </Badge>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-grow p-4 items-center justify-center">
            <div className="flex items-center justify-center  relative bg-gray-100 rounded-lg overflow-hidden max-h-[200px]">
              <Image width={100} height={100} 
                src={book.image || "/placeholder-book.jpg"}
                alt={book.title}
                className="object-cover  w-full h-full"
              />
            </div>
          </CardContent>

          <CardFooter className="flex-none p-4">
            <div className="flex justify-between w-full gap-2">
            <BookQR bookName={book.title} />
              <div className="flex gap-1">
               <UpdateBook id={book.id} />
              <DeleteBook id={book.id} />
              </div>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
