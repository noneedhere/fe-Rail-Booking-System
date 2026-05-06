import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastProvider } from "@/components/toast-provider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Reil - Train Ticket Booking",
  description: "SMK Telkom Malang - Praktikum RPL",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} antialiased`}
        style={{ fontFamily: "var(--font-poppins)" }}
      >
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
