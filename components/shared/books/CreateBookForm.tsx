"use client";
import { Button } from "@/components/ui/button";
import { TerminalIcon, Files } from "lucide-react";
import Form from "next/form";
import Link from "next/link";
import React, { useActionState, useEffect, useRef, useState } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import Image from "next/image";
import { createBook } from "@/lib/actions/bookActions";

type ImageError = string | null;
type Preview = string | null;

const CreateBookForm = () => {
  const [errorMessage, formAction, isPending] = useActionState(
    createBook,
    undefined
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { quill, quillRef } = useQuill();
  const [description, setDescription] = useState<string>("");
  const [preview, setPreview] = useState<Preview>(null);
  const [imageError, setImageError] = useState<ImageError>(null);
  const [useImageUrl, setUseImageUrl] = useState(false);

  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ] as const;
  type AcceptedImageType = (typeof ACCEPTED_IMAGE_TYPES)[number];

  useEffect(() => {
    if (quill) {
      quill.on("text-change", () => {
        setDescription(quill.root.innerHTML);
      });
    }
  }, [quill]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError(null);

    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setImageError("Image size must be less than 5MB");
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type as AcceptedImageType)) {
      setImageError("Only .jpg, .jpeg, .png and .webp formats are supported");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      setPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const permissions = [
    { id: "CHATBOT", name: "chat boot" },
    { id: "TODOTASK", name: "todo task" },
    { id: "FUTUREDAY", name: "futur day" },
    { id: "AITOOLS", name: "ai tools" },
    { id: "FOCUS", name: "focus" },
    { id: "ALL", name: "all" },
  ];

  return (
    <Form action={formAction}>
      <div className="rounded-md p-4 md:p-6 flex flex-col gap-4">
        {/* Permissions Checkboxes */}
        <div className="mb-4">
          <label className="mb-2 block text-base font-medium">
            Choose permissions
          </label>
          <div className="grid grid-cols-2 gap-4">
            {permissions.map((permission) => (
              <div key={permission.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`permission-${permission.id}`}
                  name="permission"
                  value={permission.id}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <label htmlFor={`permission-${permission.id}`}>
                  {permission.name}
                </label>
              </div>
            ))}
          </div>
          {errorMessage?.errors?.permission && (
            <div className="mt-2 text-sm text-red-500">
              {errorMessage.errors.permission.map((error) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          )}
        </div>

        {/* Title Input */}
        <div className="mb-4">
          <label htmlFor="title" className="mb-2 block text-base font-medium">
            Book title
          </label>
          <div className="relative">
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Enter book title"
              className="peer block w-full rounded-md border py-2 pl-10 text-base outline-2"
            />
            <TerminalIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2" />
          </div>
          {errorMessage?.errors?.title && (
            <div className="mt-2 text-sm text-red-500">
              {errorMessage.errors.title.map((error) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          )}
        </div>

        {/* Rich Text Editor */}
        <div className="mb-4">
          <label htmlFor="pitch" className="mb-2 block text-sm font-medium">
            Book description
          </label>
          <div className="relative">
            <div style={{ width: "100%", height: 400 }}>
              <div ref={quillRef} />
            </div>
            <input id="pitch" name="pitch" type="hidden" value={description} />
          </div>
          {errorMessage?.errors?.permission && (
            <div className="mt-2 text-sm text-red-500">
              {errorMessage.errors.permission.map((error) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          )}
        </div>

        {/* Image Upload */}
        <div className="my-4">
          <label htmlFor="image" className="mb-2 block text-sm font-medium">
            Book image
          </label>

          {/* Toggle between URL and Upload */}
          <div className="flex gap-4 mb-4">
            <Button
              type="button"
              variant={useImageUrl ? "outline" : "default"}
              onClick={() => setUseImageUrl(false)}
            >
              Upload Image
            </Button>
            <Button
              type="button"
              variant={useImageUrl ? "default" : "outline"}
              onClick={() => setUseImageUrl(true)}
            >
              Image URL
            </Button>
          </div>

          {useImageUrl ? (
            // Image URL Input
            <div className="relative">
              <input
                id="imageUrl"
                name="imageUrl"
                type="url"
                placeholder="Enter image URL"
                className="peer block w-full rounded-md border py-2 pl-10 text-base outline-2"
              />
              <TerminalIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2" />
            </div>
          ) : (
            // Image Upload Input
            <div className="flex flex-col items-center gap-4">
              <div className="w-full flex justify-center">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-700 hover:bg-gray-200 px-4 py-2 rounded-lg border-2 border-dashed border-blue-300 flex items-center gap-2"
                >
                  <TerminalIcon className="h-5 w-5" />
                  Upload Image
                </button>
                <input
                  ref={fileInputRef}
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {imageError && <p className="text-sm text-red-500">{imageError}</p>}

          {preview && !useImageUrl && (
            <div className="w-1/3 aspect-video rounded-lg overflow-hidden border-2 border-gray-200 mt-4">
              <Image
                width={300}
                height={300}
                src={preview}
                alt="Preview"
                className="w-full h-full object-fill"
              />
            </div>
          )}
        </div>

        {/* Form Error Messages */}
        {errorMessage?.message && (
          <p className="mt-2 text-sm text-red-500">{errorMessage.message}</p>
        )}
      </div>

      {/* Form Actions */}
      <div className="mt-6 flex justify-end gap-4">
        <Button variant="outline" asChild>
          <Link href="/dashboard/books">Cancel</Link>
        </Button>
        <Button type="submit">Create Book</Button>
      </div>
    </Form>
  );
};

export default CreateBookForm;
