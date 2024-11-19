import type { Metadata } from "next";
import styles from './styles.module.css'
import "./global.css";
import { Provider } from "@/components/ui/provider"
import { Poppins } from "next/font/google"
import { Header } from "@/components/Header";

const poppins = Poppins({
    subsets: ["latin"],
    weight: "400"
});


export const metadata: Metadata = {
    title: "Hackathon",
    description: "Hackathon",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (

        <html lang="en" className={poppins.className} >
            <body suppressHydrationWarning={false}>
                <>
                    <Provider>
                        <Header />
                        {children}
                    </Provider>
                </>
            </body>
        </html>
    );
}
