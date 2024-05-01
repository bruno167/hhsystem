import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.scss";

const monstserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Logoipsum",
  description: "Logoipsum Admin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={monstserrat.className}>{children}</body>
    </html>
  );
}
