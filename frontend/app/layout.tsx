import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import './globals.css'
import Link from "next/link"
import {useEffect, useState} from "react"

const inter = Inter({subsets: ['latin']})

export const metadata: Metadata = {
  title: 'Jobjigsaw',
  description: '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <div className='flex flex-col min-h-screen'>
      <nav className="bg-gray-800 dark:bg-gray-900 text-white p-4">
        <ul className="flex justify-between">
          <div className="flex space-x-4">
            {/* Navigation Links */}
            <li><Link href="/main-resume" className="hover:text-gray-300 dark:hover:text-gray-400">Main Resume</Link></li>
            <li><Link href="/saved-jobs" className="hover:text-gray-300 dark:hover:text-gray-400">Saved Jobs</Link></li>
            <li><Link href="/saved-resumes" className="hover:text-gray-300 dark:hover:text-gray-400">Saved Resumes</Link></li>
          </div>

        </ul>
      </nav>
      <main className="flex-grow p-4">
        {children}
      </main>
      <footer className="bg-gray-700 dark:bg-gray-800 text-white p-4 text-center">
        © 2023 Jobjigsaw
      </footer>
    </div>
  )
}
