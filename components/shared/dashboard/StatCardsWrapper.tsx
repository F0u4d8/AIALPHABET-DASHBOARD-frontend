import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { BanknoteIcon, ClockIcon, InboxIcon, UsersIcon } from 'lucide-react'
import { lusitana } from '../fonts'
import { fetchStatistics } from '@/lib/actions/statisticsActions'

const iconMap = {
  collected: BanknoteIcon,
  customers: UsersIcon,
  pending: ClockIcon,
  invoices: InboxIcon,
}

export default async function StatCardsWrapper() {
  const { usersCount, categoriesCount, contentsCount, codesCount } = await fetchStatistics();

  return (
    <>
      <StatCard title="Users" value={usersCount} type="customers" />
      <StatCard title="Categories" value={categoriesCount} type="pending" />
      <StatCard title="Contents" value={contentsCount} type="invoices" />
      <StatCard title="QR Codes" value={codesCount} type="collected" />
    </>
  )
}

export function StatCard({
  title,
  value,
  type,
}: {
  title: string
  value: number | string
  type: 'invoices' | 'customers' | 'pending' | 'collected'
}) {
  const Icon = iconMap[type]

  return (
    <Card>
      <CardHeader className="flex flex-row  space-y-0 space-x-3 ">
        {Icon ? <Icon className="h-5 w-5" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </CardHeader>
      <CardContent>
        <p
          className={`${lusitana.className}
               truncate rounded-xl   p-4  text-2xl`}
        >
          {value}
        </p>
      </CardContent>
    </Card>
  )
}