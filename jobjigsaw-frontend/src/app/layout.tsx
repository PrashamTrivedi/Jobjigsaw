import type {Metadata} from "next"
import "./globals.css"
import NavLinks from "@/components/NavLinks"
import { ToastProvider } from "@/components/ui"
import { ThemeProvider } from "@/components/DarkModeProvider"

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('jobjigsaw-theme') || 'system';
                const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                document.documentElement.classList.add(isDark ? 'dark' : 'light');
              } catch (e) {
                document.documentElement.classList.add('light');
              }
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning={true}>
        <ThemeProvider defaultTheme="system" storageKey="jobjigsaw-theme">
          <ToastProvider>
            <a href="#main-content" className="skip-link">
              Skip to main content
            </a>
            <div className='flex flex-col min-h-screen bg-background text-foreground'>
              <nav className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-primary-foreground px-6 py-6 shadow-lg border-b border-border/20" role="navigation" aria-label="Main navigation">
                <NavLinks />
              </nav>

              <main id="main-content" className="flex-grow bg-background" role="main">
                {children}
              </main>
              
              <footer className="bg-secondary text-secondary-foreground px-6 py-4 text-center text-sm border-t border-border">
                © 2025 Jobjigsaw
              </footer>
            </div>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
