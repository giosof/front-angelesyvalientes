import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/ui/globals.css";
import { Provider } from '@/components/ui/provider'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ángeles y Valientes",
  description: "Plataforma de Gestión Corporación Ángeles y Valientes",
};

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  return (
    <html suppressHydrationWarning>
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  )
}
