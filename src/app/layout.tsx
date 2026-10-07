import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Morgül Menü | Dijital QR Menü Platformu",
  description: "Menünüzü dijitale taşıyın, işletmenizi büyütün. Modern ve hızlı QR menü ile restoranınıza değer katın.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-white text-gray-900 selection:bg-black selection:text-white">
        {children}
      </body>
    </html>
  );
}
