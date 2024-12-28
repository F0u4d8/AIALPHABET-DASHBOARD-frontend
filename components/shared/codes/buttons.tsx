import { Button } from "@/components/ui/button"
import { deleteQRCode } from "@/lib/actions/qrCodeActions"
import { TrashIcon } from "lucide-react"
import Form from "next/form"

export function DeleteCode({ id }: { id: string }) {
    const deleteCodeWithId = deleteQRCode.bind(null, id)
  
    return (
      <Form action={deleteCodeWithId}>
        <Button variant="outline" type="submit">
          <span className="sr-only">Delete</span>
          <TrashIcon className="w-5" />
        </Button>
      </Form>
    )
  }