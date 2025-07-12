
import {Navigate, Outlet} from "react-router-dom"
import NavLinks from "./navLinks"

export default function MainContent() {
    const pathName = window.location.pathname
    console.log({pathName, location: window.location})
    return (
        <div className='flex flex-col min-h-screen'>
            <nav className=" text-white p-4 lg:flex lg:justify-between">
                <NavLinks />
            </nav>

            <div className='flex flex-col min-h-screen'>
                <main className="flex-grow p-4">
                    <Outlet />
                    {pathName === '/' && <Navigate to="/home" replace={true} />}
                </main>
            </div>
            <footer className=" text-white p-4 text-start text-sm">
                © 2023 Jobjigsaw
            </footer>
        </div>

    )
}