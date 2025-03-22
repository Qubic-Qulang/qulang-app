import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import {ConfigProvider} from "@/contexts/ConfigContext";
import {QubicConnectCombinedProvider} from "@/contexts/QubicConnectContext";
import {HM25Provider} from "@/contexts/HM25Context";

const spaceGroteskSans = Space_Grotesk({
  variable: "--font-space-grotesk-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QuLang app",
  description: "Welcome to the QuLang dApp !",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGroteskSans.variable} antialiased`}>
      <ConfigProvider>
          <QubicConnectCombinedProvider>
              <HM25Provider>
                  <div className="flex flex-col min-h-dvh ">
                      <Header />
                      <div className="flex-1 flex flex-col">
                          {children}
                      </div>
                      <Footer />
                  </div>
              </HM25Provider>
          </QubicConnectCombinedProvider>
      </ConfigProvider>
      </body>
    </html>
  );
}
