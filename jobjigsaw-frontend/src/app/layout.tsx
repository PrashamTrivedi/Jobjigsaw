import type {Metadata} from "next"
import "./globals.css"
import { ToastProvider } from "@/components/ui"
import { ThemeProvider } from "@/components/DarkModeProvider"
import SideNav from "@/components/SideNav"

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
            <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
              <div className="w-full flex-none md:w-64">
                <SideNav />
              </div>
              <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
            </div>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
