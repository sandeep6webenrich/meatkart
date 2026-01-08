import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "MeatKart is one of the premium online meat delivery website in Hyderabad, India.",
  description: "Shop for high quality halal cut ready to eat or cook, marinated boiler, organic free range or country Chicken, Lamb or Sea Food now for quick delivery and at best prices.",
  keywords: "MeatKart, Mutton, Chicken, Fish, Buy, Online"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="/css/bootstrap.min.css" rel="stylesheet" />
        <link href="/css/style.css" rel="stylesheet" type="text/css" />
        {/* HTML5 shim and Respond.js for IE8 support */}
      </head>
      <body>
        <div className="page">
          <Header />
          {children}
          <Footer />
        </div>
        <Toaster position="top-center" />
        {/* We might need to load Bootstrap JS if interaction requires it, but prefer React */}
        {/* <script src="/js/bootstrap.min.js"></script> */}
      </body>
    </html>
  );
}
