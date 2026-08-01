import { ThemeProvider } from '@/components/providers/ThemeProvider'

export default function SharePhotosLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange={false}
    >
      {children}
    </ThemeProvider>
  )
}
