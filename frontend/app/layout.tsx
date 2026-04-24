import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hotel Booking Platform - Find Your Perfect Stay",
  description: "Book luxury hotels and packages for your next getaway. Best rates guaranteed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#fafbfc]">{children}</body>
    </html>
  );
}

