import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Layout from "@/components/layout/Layout";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GreenGarden - Grow Your Own Vegetables",
  description: "Your one-stop destination for high-quality plant saplings and gardening supplies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <Layout>{children}</Layout>
          <Toaster position="bottom-right" />
        </CartProvider>
      </body>
    </html>
  );
}
