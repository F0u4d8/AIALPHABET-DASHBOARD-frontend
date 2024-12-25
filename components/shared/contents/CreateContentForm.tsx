"use client"
import { Button } from '@/components/ui/button'
import { createContent } from '@/lib/actions/contentsActions'
import { TerminalIcon, Files } from 'lucide-react'
import Form from 'next/form'
import Link from 'next/link'
import React, { useActionState, useState } from 'react'
import { Category } from '@prisma/client'
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';


const CreateContentForm = ({ categories }: { categories:Partial <Category>[] }) => {
    const [errorMessage, formAction, isPending] = useActionState(
        createContent,
        undefined
      )

      const { quill, quillRef } = useQuill();
      const [description, setDescription] = useState('');
    
      // Update description state when Quill content changes
      React.useEffect(() => {
        if (quill) {
          quill.on('text-change', () => {
            setDescription(quill.root.innerHTML);
          });
        }
      }, [quill]);


  return (
    <Form action={formAction}>
  <div className="rounded-md p-4 md:p-6">
  <label htmlFor="category" className="mb-2 block text-sm font-medium">
            Choose category
          </label>
          <div className="relative">
            <select
              id="categoryId"
              name="categoryId"
              className="peer block w-full cursor-pointer rounded-md border  py-2 pl-10 text-sm outline-2 "
              defaultValue=""
              aria-describedby="category-error"
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <Files className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 " />
          </div>


    {/* Name field stays the same */}
    <div className="mb-4">
      <label htmlFor="title" className="mb-2 block text-sm font-medium">
        Content title
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
        {errorMessage?.errors?.title &&
          errorMessage.errors.title.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}
      </div>
    </div>



    {/* Name field stays the same */}
    <div className="mb-4">
      <label htmlFor="url" className="mb-2 block text-sm font-medium">
        Content url
      </label>
      <div className="relative mt-2 rounded-md">
        <div className="relative">
          <input
            id="url"
            name="url"
            type="text"
            placeholder="Enter content url"
            className="peer block w-full rounded-md border py-2 pl-10 text-sm outline-2"
          />
          <TerminalIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2" />
        </div>
      </div>
      <div id="url-error" aria-live="polite" aria-atomic="true">
        {errorMessage?.errors?.url &&
          errorMessage.errors.url.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}
      </div>
    </div>

    

    {/* Modified description field with Flutter-friendly markdown guidance */}
    <div className="mb-4">
      <label htmlFor="description" className="mb-2 block text-sm font-medium">
        Content pitch
      
      </label>
      <div className="relative mt-2 rounded-md">
        <div className="relative">
        <div style={{ width: '100%', height: 400 }}>
      <div ref={quillRef} />
    </div>
          <input
            id="pitch"
            name="pitch"
            type="hidden"
            value={description}
          />
        </div>
      </div>
      <div id="description-error" aria-live="polite" aria-atomic="true">
        {errorMessage?.errors?.pitch &&
          errorMessage.errors.pitch.map((error: string) => (
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
    <Button type="submit">Create Content</Button>
  </div>
</Form>
  )
}

export default CreateContentForm