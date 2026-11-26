import type { Metadata } from "next";
import { Suspense } from "react";
import { Poppins } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "@/components/theme/ThemeRegistry";
import { AuthProvider } from "@/context/AuthContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Sixtify Help — Category Management",
  description: "Help Center Category & Sub Category management demo with Next.js & MUI",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${poppins.className} ${poppins.variable}`}>
      <body>
        <ThemeRegistry>
          <Suspense fallback={null}>
            <AuthProvider>{children}</AuthProvider>
          </Suspense>
        </ThemeRegistry>
      </body>
    </html>
  );
}
