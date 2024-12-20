import { Layout } from './components/ui/layout'
import './globals.css'
import { Inter, Montserrat } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-heading' })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh" className={`${inter.variable} ${montserrat.variable}`}>
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}

