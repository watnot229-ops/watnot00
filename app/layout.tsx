import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Watnot – 10 Minutes. Delivered.",
  description: "Order groceries and essentials. Delivered in 10 minutes to your door.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-black">
      <body className="min-h-screen bg-black text-white font-body antialiased">
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              borderRadius: "12px",
              background: "#1A1A1A",
              color: "#fff",
              fontFamily: "Satoshi, sans-serif",
            },
          }}
        />
      </body>
    </html>
  );
}
