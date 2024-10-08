import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "react-loading-skeleton/dist/skeleton.css";
import { MittProvider } from "@/components/events/useMitt";
import { AddContentDialog } from "@/components/forms/AddContentDialog";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PublicEnvScript } from "next-runtime-env";
import type { ReactNode } from "react";
import { SkeletonTheme } from "react-loading-skeleton";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "Sidepages",
    description: "A content management system for sidepages",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning={true}>
            <head>
                <PublicEnvScript />
            </head>
            <body className={`${inter.className}`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem={true}
                    disableTransitionOnChange={true}
                >
                    <SkeletonTheme
                        baseColor="hsl(var(--muted))"
                        highlightColor="hsl(var(--background))"
                    >
                        <MittProvider>
                            <TooltipProvider>
                                <div
                                    vaul-drawer-wrapper=""
                                    className="min-h-[100vh] bg-background"
                                >
                                    {children}
                                    <AddContentDialog />
                                </div>
                            </TooltipProvider>
                        </MittProvider>
                    </SkeletonTheme>
                </ThemeProvider>
            </body>
        </html>
    );
}
