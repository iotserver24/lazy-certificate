import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'Lazy Certification',
  description: 'Generate professional certificates effortlessly with Lazy Certification. Upload templates, add recipient names, customize text, and batch generate certificates for your team or event.',
  generator: 'v0.dev',
  openGraph: {
    title: 'Lazy Certification - Effortless Certificate Generation',
    description: 'Generate professional certificates effortlessly with Lazy Certification. Upload templates, add recipient names, customize text, and batch generate certificates for your team or event.',
    url: 'https://lazycertification.vercel.app', // Replace with your actual deployment URL
    siteName: 'Lazy Certification',
    images: [
      {
        url: '/certificate-generator-tool.png', // Placeholder image
        width: 1200,
        height: 630,
        alt: 'Lazy Certification App Screenshot',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lazy Certification - Effortless Certificate Generation',
    description: 'Generate professional certificates effortlessly with Lazy Certification. Upload templates, add recipient names, customize text, and batch generate certificates for your team or event.',
    images: ['/certificate-generator-tool.png'], // Placeholder image
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
