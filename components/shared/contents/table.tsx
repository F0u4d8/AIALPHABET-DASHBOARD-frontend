
import { fetchFilteredContents } from '@/lib/actions/contentsActions'
import Image from 'next/image'
import { DeleteContent, UpdateContent } from './buttons'

export default async function ContentsTable({
  query,
  currentPage,
}: {
  query: string | null
  currentPage: number
}) {
   const contents = await fetchFilteredContents(query, currentPage)

  return (
    <div className="mt-6 flow-root">
    <div className="inline-block min-w-full align-middle">
      <div className="rounded-lg p-2 md:pt-0">
        <div className="md:hidden">
          {contents?.map((content) => (
            <div key={content.id} className="mb-2 w-full rounded-md  p-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <div className="mb-2 flex items-center ">
                    <Image
                      src={content.image}
                      className="mr-2 rounded-full bg-gray-200"
                      width={28}
                      height={28}
                      alt={`${content.title}'s profile picture`}
                    />
                    <p>{content.title}</p>
                  </div>
                  <p className="text-sm ">{content.category.name}</p>
                </div>
              </div>
              <div className="flex w-full items-center justify-between pt-4">
               
                <div className="flex justify-end gap-2">
                  <UpdateContent id={content.id} />
                  <DeleteContent id={content.id} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <table className="hidden min-w-full   md:table">
          <thead className="rounded-lg text-left text-sm font-normal">
            <tr>
              <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                Title
              </th>
              <th scope="col" className="px-3 py-5 font-medium">
                Category
              </th>
             
              <th scope="col" className="relative py-3 pl-6 pr-3">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {contents?.map((content) => (
              <tr
                key={content.id}
                className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
              >
                <td className="whitespace-nowrap py-3 pl-6 pr-3">
                  <div className="flex items-center gap-3">
                    <Image
                      src={content.image}
                      className="rounded-full bg-gray-200"
                      width={28}
                      height={28}
                      alt={`${content.title}'s profile picture`}
                    />
                    <p>{content.title}</p>
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  {content.category.name}
                </td>
               
              
                <td className="whitespace-nowrap py-3 pl-6 pr-3">
                  <div className="flex justify-end gap-3">
                  <UpdateContent id={content.id} />
                  <DeleteContent id={content.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  )
}