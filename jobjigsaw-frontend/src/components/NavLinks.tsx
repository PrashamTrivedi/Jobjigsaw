'use client'

import {Bars3BottomLeftIcon, BriefcaseIcon, DocumentIcon, HomeIcon} from "@heroicons/react/20/solid"
import clsx from "clsx"
import {useState} from "react"
import Link from "next/link"
import {usePathname} from 'next/navigation'
import {ThemeToggle} from './ThemeToggle'

export default function NavLinks() {
  const links = [
    {path: '/', label: 'Home', icon: HomeIcon},
    {path: '/main-resume', label: 'Main Resume', icon: DocumentIcon},
    {path: '/saved-jobs', label: 'Saved Jobs', icon: BriefcaseIcon},
    {path: '/saved-resumes', label: 'Saved Resumes', icon: DocumentIcon},
    {path: '/saved-resumes/resume/print', label: 'Generate Resumes On the fly', icon: DocumentIcon},
  ]
  const [isNavOpen, setIsNavOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className='flex flex-col lg:flex-row items-center justify-between w-full mx-auto h-full'>
      <div className="flex items-center justify-between w-full lg:w-auto">
        <div className="flex items-center gap-4">
          <div className="text-3xl font-bold text-primary-foreground">
            🧩 Jobjigsaw
          </div>
          <button
            onClick={() => setIsNavOpen(!isNavOpen)}
            className="lg:hidden text-primary-foreground hover:text-accent-foreground p-2 rounded-md hover:bg-primary-foreground/10 transition-colors"
          >
            <Bars3BottomLeftIcon className="w-6 h-6" />
          </button>
        </div>

      </div>

      <ul className={clsx(
        `flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6 transition-all duration-300 ease-in-out overflow-hidden w-full lg:w-auto`,
        isNavOpen ? 'max-h-screen mt-6 lg:mt-0' : 'max-h-0 lg:max-h-full',
      )}>
        {links.map(({path, label, icon: Icon}) => {
          const isActive = path === pathname
          return (
            <li key={path} className="w-full lg:w-auto relative">
              <Link
                href={path}
                className={clsx(
                  "flex items-center px-6 py-3 lg:px-8 lg:py-4 rounded-lg transition-all duration-200 relative overflow-hidden group",
                  "text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10",
                  isActive
                    ? "bg-primary-foreground/15 font-semibold text-white shadow-md"
                    : "hover:bg-primary-foreground/8 hover:text-white hover:scale-105"
                )}
              >
                <Icon className={clsx(
                  "w-6 h-6 mr-3 shrink-0 transition-transform duration-200",
                  isActive ? "text-white" : "text-primary-foreground/80",
                  "group-hover:scale-110"
                )} />
                <span className="text-lg font-medium whitespace-nowrap">{label}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                )}
              </Link>
            </li>
          )
        })}
      </ul>

      <ThemeToggle />
    </div>
  )
}
