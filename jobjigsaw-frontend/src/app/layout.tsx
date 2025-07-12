import type {Metadata} from "next"
import "./globals.css"
import NavLinks from "@/components/NavLinks"
import { ToastProvider } from "@/components/ui"

export const metadata: Metadata = {
  title: "Jobjigsaw",
  description: "Streamline your job application process",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ToastProvider>
          <div className='flex flex-col min-h-screen bg-background text-foreground'>
            <nav className="bg-primary text-primary-foreground p-4 shadow-md">
              <NavLinks />
            </nav>

            <main className="flex-grow p-6 bg-background">
              {children}
            </main>
            
            <footer className="bg-secondary text-secondary-foreground p-4 text-center text-sm border-t">
              © 2025 Jobjigsaw
            </footer>
          </div>
        </ToastProvider>
      </body>
    </html>
  )
}
