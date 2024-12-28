import Link from 'next/link'
import { lusitana } from './fonts'
import Image from 'next/image'
import { APP_NAME } from '@/lib/constants'

export default function AppLogo() {
  return (
    <Link href="/" className="flex-start">
      <div
        className={`${lusitana.className} flex flex-row items-end space-x-2`}
      >
        <Image
          src="/logo.png"
          width={200}
          height={200}
          alt={`${APP_NAME} logo`}
          priority
        />
      </div>
    </Link>
  )
}