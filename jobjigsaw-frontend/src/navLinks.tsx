
import {Bars3BottomLeftIcon, BriefcaseIcon, DocumentIcon, HomeIcon} from "@heroicons/react/20/solid"
import clsx from "clsx"
import {useState} from "react"

export default function NavLinks() {
    const links = [
        {path: '/home', label: 'Home', icon: HomeIcon},
        {path: '/main-resume', label: 'Main Resume', icon: DocumentIcon},
        {path: '/saved-jobs', label: 'Saved Jobs', icon: BriefcaseIcon},
        {path: '/saved-resumes', label: 'Saved Resumes', icon: DocumentIcon},
        {path: '/saved-resumes/resume/print', label: 'Generate Resumes On the fly', icon: DocumentIcon},

    ]
    const [isNavOpen, setIsNavOpen] = useState(false)
    let pathName = window.location.pathname
    if (pathName === '/') {
        pathName = '/home'
    }
    console.log({pathName, location: window.location})
    return (

        <div className='flex flex-col lg:flex-row items-start lg:items-center  lg:block justify-between'>
            <button onClick={() => setIsNavOpen(!isNavOpen)} className="lg:hidden">
                <Bars3BottomLeftIcon className="w-5 h-5" />
            </button>

            <ul className={`flex flex-col lg:flex-row items-start lg:items-center lg:flex justify-between transition-max-height duration-500 ease-in-out overflow-hidden ${isNavOpen ? 'max-h-screen' : 'max-h-0'} lg:max-h-screen`}>
                {
                    links.map(({path, label, icon: Icon}) => (
                        <li key={path} className={clsx("px-5 py-2 flex", {" border-b-2 border-current border-gray-600 dark:border-gray-50": path === pathName})}>
                            <a href={path} className="flex dark:text-gray-300 text-gray-950 hover:text-gray-600 dark:hover:text-gray-400">
                                <Icon className="w-5 h-5 mr-2" /> {label}
                            </a>
                        </li>
                    ))
                }
            </ul>
        </div>

    )

}