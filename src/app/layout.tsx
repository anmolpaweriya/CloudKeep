import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LoadingScreenProvider from "@/context/loadingScreenContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CloudKeep",
  description: "free storage to upload and access your files from anywere",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>

        <LoadingScreenProvider>

          {children}

        </LoadingScreenProvider>

      </body>
    </html>
  );
}
