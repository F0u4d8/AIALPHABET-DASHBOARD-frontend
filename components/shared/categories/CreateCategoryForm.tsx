"use client"
import { Button } from '@/components/ui/button'
import { createCategory } from '@/lib/actions/categoriesActions'
import { TerminalIcon } from 'lucide-react'
import Form from 'next/form'
import Link from 'next/link'
import React, { useActionState, useEffect, useState } from 'react'
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';

const CreateCategoryForm = () => {
    const [errorMessage, formAction, isPending] = useActionState(
        createCategory,
        undefined
      )

const { quill, quillRef } = useQuill();
      const [description, setDescription] = useState('');
    
      // Update description state when Quill content changes
      useEffect(() => {
        if (quill) {
          quill.on('text-change', () => {
            setDescription(quill.root.innerHTML);
          });
        }
      }, [quill]);

  return (
    <Form action={formAction}>
  <div className="rounded-md p-4 md:p-6">
    {/* Name field stays the same */}
    <div className="mb-4">
      <label htmlFor="name" className="mb-2 block text-sm font-medium">
        Category name
      </label>
      <div className="relative mt-2 rounded-md">
        <div className="relative">
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter Category name"
            className="peer block w-full rounded-md border py-2 pl-10 text-sm outline-2"
          />
          <TerminalIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2" />
        </div>
      </div>
      <div id="name-error" aria-live="polite" aria-atomic="true">
        {errorMessage?.errors?.name &&
          errorMessage.errors.name.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}
      </div>
    </div>

    {/* Modified description field with Flutter-friendly markdown guidance */}
    <div className="mb-4">
      <label htmlFor="description" className="mb-2 block text-sm font-medium">
        Category description
        <span className="ml-1 text-xs text-gray-500">
          (Basic formatting supported)
        </span>
      </label>
      <div className="relative mt-2 rounded-md">
        <div className="relative">
        <div style={{ width: '100%', height: 400 }}>
      <div ref={quillRef} />
    </div>
          <input
            id="description"
            name="description"
            type="hidden"
            value={description}
          />
        </div>
      </div>
       
      <div id="description-error" aria-live="polite" aria-atomic="true">
        {errorMessage?.errors?.description &&
          errorMessage.errors.description.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}
      </div>
   
    </div>

    <div aria-live="polite" aria-atomic="true">
      {errorMessage?.message ? (
        <p className="mt-2 text-sm text-red-500">{errorMessage.message}</p>
      ) : null}
    </div>
  </div>

  <div className="mt-6 flex justify-end gap-4">
    <Button variant="outline" asChild>
      <Link href="/dashboard/categories">Cancel</Link>
    </Button>
    <Button type="submit">Create Category</Button>
  </div>
</Form>
  )
}

export default CreateCategoryForm