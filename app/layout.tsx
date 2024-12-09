import { auth } from '@/auth'
import './globals.css'
import { inter } from '@/components/shared/fonts'
import { APP_DESCRIPTION, APP_NAME, SERVER_URL } from '@/lib/constants'
import { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes'

export const metadata: Metadata = {
  title: {
    template: `%s | ${APP_NAME}`,
    default: APP_NAME,
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL(SERVER_URL),
}
export const experimental_ppr = true
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
      <SessionProvider session={session} >
      <ThemeProvider
     attribute="class"
     defaultTheme="system"
     enableSystem
     disableTransitionOnChange
   >
     {children}
   </ThemeProvider></SessionProvider>
      </body>
    </html>
  )
}