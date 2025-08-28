import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import Providers from "@/app/providers";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import RefreshToken from "@/app/RefreshToken";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Next.js + Tailwind",
};

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="ko" className="h-full">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-full min-h-screen`}>
                <RefreshToken />
                <div className="mx-auto md:container md:min-h-[calc(100dvh-358px-64px)]">
                    <Providers>
                        <Header/>
                        <main className="pb-13 pt-[24px] md:py-[40px] lg:py-[80px] relative">{children}</main>
                        <Footer/>
                    </Providers>
                </div>
            </body>
        </html>
    );
}
