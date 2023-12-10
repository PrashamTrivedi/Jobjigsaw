'use client'
import {BriefcaseIcon, DocumentIcon, HomeIcon} from "@heroicons/react/20/solid"
import clsx from "clsx"
import Link from "next/link"
import {usePathname} from "next/navigation"

export default function NavLinks() {
    const links = [
        {path: '/', label: 'Home', icon: HomeIcon},
        {path: '/main-resume', label: 'Main Resume', icon: DocumentIcon},
        {path: '/saved-jobs', label: 'Saved Jobs', icon: BriefcaseIcon},
        {path: '/saved-resumes', label: 'Saved Resumes', icon: DocumentIcon},

    ]
    const pathName = usePathname()
    return (

        <div className="flex items-center">
            {
                links.map(({path, label, icon: Icon}) => (
                    <li key={path} className={clsx("px-5 py-2 flex items-center rounded", {"bg-gray-900 dark:bg-gray-800": path === pathName})}>
                        <Link href={path} className="flex items-center hover:text-gray-300 dark:hover:text-gray-400">
                            <Icon className="w-5 h-5 mr-2" /> {label}
                        </Link>
                    </li>
                ))
            }
        </div>

    )

}