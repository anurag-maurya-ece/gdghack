import { Outfit, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-outfit",
  display: "swap",
});

const devanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "600"],
  variable: "--font-devanagari",
  display: "swap",
});

export const metadata = {
  title: "Tech Thela | Apni gali, apna thela",
  description:
    "Aapka thela, ab sabki nazar mein. Bringing neighbourhood street vendors and customers closer.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${devanagari.variable}`}>
      <body>
        <a className="skip-link button" href="#main">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
