'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Files, HomeIcon, QrCode  } from 'lucide-react'

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
              pathname === link.href ? '' : 'text-muted-foreground'
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