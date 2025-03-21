'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Files, HomeIcon, QrCode ,BookAIcon } from 'lucide-react'

const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Categories',
    href: '/dashboard/categories',
    icon: Files,
  },
  {
    name: 'Contents',
    href: '/dashboard/contents',
    icon: Files,
  },
  { name: 'codes', href: '/dashboard/codes', icon: QrCode },
  { name: 'books', href: '/dashboard/books', icon: BookAIcon },
  { name: 'settings', href: '/dashboard/settings', icon: BookAIcon },
]

export default function NavLinks() {
  const pathname = usePathname()

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon
        return (
          <Link
            key={link.name}
            href={link.href}
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              'justify-start',
              pathname === link.href ? '' : 'text-muted-foreground p-1'
            )}
          >
            <LinkIcon className="mr-2 h-6 w-6" />
            <span className="hidden md:block">{link.name}</span>
          </Link>
        )
      })}
    </>
  )
}