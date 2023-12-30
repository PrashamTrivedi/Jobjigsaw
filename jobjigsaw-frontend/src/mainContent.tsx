
import {Outlet} from "react-router-dom"
import NavLinks from "./navLinks"

export default function MainContent() {
    return (
        <div className='flex flex-col min-h-screen'>
            <nav className=" text-white p-4 lg:flex lg:justify-between">
                <NavLinks />
            </nav>

            <div className='flex flex-col min-h-screen'>
                <main className="flex-grow p-4">
                    <Outlet />
                </main>
            </div>
            <footer className=" text-white p-4 text-start text-sm">
                © 2023 Jobjigsaw
            </footer>
        </div>

    )
}