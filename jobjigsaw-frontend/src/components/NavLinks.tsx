'use client'

import { Bars3BottomLeftIcon, BriefcaseIcon, DocumentIcon, HomeIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';

export default function NavLinks() {
  const links = [
    { path: '/', label: 'Home', icon: HomeIcon },
    { path: '/main-resume', label: 'Main Resume', icon: DocumentIcon },
    { path: '/saved-jobs', label: 'Saved Jobs', icon: BriefcaseIcon },
    { path: '/saved-resumes', label: 'Saved Resumes', icon: DocumentIcon },
    { path: '/saved-resumes/resume/print', label: 'Generate Resumes On the fly', icon: DocumentIcon },
  ];
  const [isNavOpen, setIsNavOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className='flex flex-col lg:flex-row items-start lg:items-center justify-between w-full'>
      <button 
        onClick={() => setIsNavOpen(!isNavOpen)} 
        className="lg:hidden text-primary-foreground hover:text-accent-foreground p-2"
      >
        <Bars3BottomLeftIcon className="w-6 h-6" />
      </button>

      <ul className={clsx(
        `flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-4 transition-all duration-300 ease-in-out overflow-hidden w-full lg:w-auto`,
        isNavOpen ? 'max-h-screen mt-4 lg:mt-0' : 'max-h-0 lg:max-h-full',
      )}>
        {links.map(({ path, label, icon: Icon }) => (
          <li key={path} className={clsx(
            "w-full lg:w-auto",
            { "bg-accent/20 rounded-md": path === pathname }
          )}>
            <Link 
              href={path} 
              className={clsx(
                "flex items-center px-4 py-2 rounded-md transition-colors duration-200",
                "text-primary-foreground hover:bg-accent/10 hover:text-accent-foreground",
                { "bg-accent/20 font-medium": path === pathname }
              )}
            >
              <Icon className="w-5 h-5 mr-2 flex-shrink-0" /> 
              <span className="text-sm lg:text-base">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
