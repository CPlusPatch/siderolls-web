import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MittProvider } from "@/components/events/useMitt";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { ReactNode } from "react";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "Siderolls",
    description: "Organize your sidetrees with Siderolls",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.className}`}>
                <MittProvider>
                    <TooltipProvider>{children}</TooltipProvider>
                </MittProvider>
            </body>
        </html>
    );
}
