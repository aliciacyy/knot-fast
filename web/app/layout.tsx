import ParallaxBackground from "./components/Background";
import "./globals.css";
import { Inter, Instrument_Serif } from "next/font/google";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: "400",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ParallaxBackground/>
        {children}
        </body>
    </html>
  );
}