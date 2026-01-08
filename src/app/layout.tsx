import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";
import { AuthProvider } from "@/components/providers/AuthProvider";
import Analytics from "@/components/Analytics";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "United Healthcare | Premium Herbal Products",
  description: "Natural and authentic herbal products for a healthier lifestyle.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://unitedhealthcare.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased min-h-screen flex flex-col bg-stone-50 text-stone-900`}>
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
        <AuthProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
