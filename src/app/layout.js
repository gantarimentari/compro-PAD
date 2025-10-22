import { Plus_Jakarta_Sans, Lora } from "next/font/google";
import "./globals.css";

const geistPrimary = Plus_Jakarta_Sans({
  variable: "--font-primary",
  subsets: ["latin"],
});

const geistSecondary = Lora({
  variable: "--font-secondary",
  subsets: ["latin"],
});

export const metadata = {
  title: "Praktek Dokter Hewan drh. Fanina",
  description: "",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistPrimary.variable} ${geistSecondary.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
