import "./globals.css";

import { Toaster } from "sonner"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
//NextIntlServerProvider 
  return (
    <html lang="en">
      <body>
          {children}
          <Toaster />
      </body>
    </html>
  );
}
