
import { fetchFilteredCategories } from '@/lib/actions/categoriesActions'
import { DeleteCategory, UpdateCategory } from './buttons'

export default async function CategoriesTable({
  query,
  currentPage,
}: {
  query: string | null
  currentPage: number
}) {
   const categories = await fetchFilteredCategories(query, currentPage)

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg p-2 md:pt-0">
          <div className="md:hidden">
            {categories?.map((category) => (
              <div key={category.id} className="mb-2 w-full rounded-md  p-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                  
                      <p>{category.name}</p>
                    </div>
                    <p className="text-sm text-muted overflow-hidden"> {category.description!.length > 100
      ? `${category.description!.substring(0, 100)}...`
      : category.description}</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
               
                  <div className="flex justify-end gap-2">
                  <UpdateCategory id={category.id} />
                  <DeleteCategory id={category.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <table className="hidden min-w-full   md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  category
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  description
                </th>
            
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {categories?.map((category) => (
                <tr
                  key={category.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 ">
                    <div className="flex items-center gap-3">
                     
                      <p>{category.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 overflow-hidden">
                <div className="truncate max-w-xs">
                  {category.description!.length > 100
                    ? `${category.description!.substring(0, 100)}...`
                    : category.description}
                </div>
              </td>
                 
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateCategory id={category.id} />
                      <DeleteCategory id={category.id} />
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