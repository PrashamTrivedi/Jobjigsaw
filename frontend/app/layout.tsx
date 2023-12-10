import type {Metadata} from 'next'
import './globals.css'
import Link from "next/link"
import {Inter} from 'next/font/google'
import NavLinks from "./ui/navLinks"


const inter = Inter({subsets: ['latin']})
export const metadata: Metadata = {
  title: 'Jobjigsaw',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {


  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>


        <div className='flex flex-col min-h-screen'>
          <nav className="bg-gray-800 dark:bg-gray-900 text-white p-4">
            <ul className="flex justify-between">
              
                <NavLinks />

              

            </ul>
          </nav>
          <main className="flex-grow p-4">
            {children}
          </main>
          <footer className="bg-gray-700 dark:bg-gray-800 text-white p-4 text-center">
            © 2023 Jobjigsaw
          </footer>
        </div>
      </body>
    </html>
  )
}
