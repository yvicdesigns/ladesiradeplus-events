import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter, Great_Vibes } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
// CustomCursor removed — using native cursor
import { WhatsAppFloat } from "@/components/ui/WhatsAppFloat";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-great-vibes",
  display: "swap",
});

export const metadata: Metadata = {
  title: "La Désirade Événements — Location Décoration Brazzaville",
  description:
    "Location de matériel de décoration événementielle haut de gamme à Brazzaville. Mariages, anniversaires, baptêmes, conférences. Commandez via WhatsApp.",
  keywords: ["décoration", "événementiel", "mariage", "Brazzaville", "Congo", "location", "matériel"],
  authors: [{ name: "La Désirade Événements" }],
  openGraph: {
    title: "La Désirade Événements",
    description: "Location de matériel de décoration événementielle haut de gamme à Brazzaville, Congo.",
    type: "website",
    locale: "fr_FR",
    siteName: "La Désirade Événements",
  },
};

export const viewport: Viewport = {
  themeColor: "#F97316",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${playfair.variable} ${inter.variable} ${greatVibes.variable}`} suppressHydrationWarning>
      <body className="bg-charcoal-deep text-off-white antialiased">
        <ThemeProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <CartSidebar />
          <WhatsAppFloat />
        </ThemeProvider>
      </body>
    </html>
  );
}
