import type { Metadata } from "next";
import styles from './styles.module.css'
import "./global.css";
import { Provider } from "@/components/ui/provider"
import { Poppins } from "next/font/google"
import {
    FiHome,
    FiSettings,
} from 'react-icons/fi';
import { MdOutlineLocationCity } from "react-icons/md";
import { RiCalendarTodoFill } from "react-icons/ri";
import { PiScrollFill } from "react-icons/pi";
import logo from "../../public/images/logo.png"
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";

const LinkItems = [
    { name: 'Dashboard', icon: FiHome, href: '/dashboard' },
    { name: 'Ambientes', icon: MdOutlineLocationCity, href: '/ambientes' },
    { name: 'Reservas', icon: RiCalendarTodoFill, href: '/reservas' },
    { name: 'Históricos', icon: PiScrollFill, href: '/historicos' },
    { name: 'Configurações', icon: FiSettings, href: '/configuracoes' },
];

const poppins = Poppins({
    subsets: ["latin"],
    weight: "400"
});


export const metadata: Metadata = {
    title: "Hackathon",
    description: "Hackathon",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (

        <html lang="en" className={poppins.className} >
            <body suppressHydrationWarning={false}>
                <>
                    <Provider>
                        <div className="min-h-screen flex flex-col bg-gray-100">
                            <div
                                className={`${styles.sidebar} fixed inset-y-0 left-0 z-30 w-64 shadow-md transform lg:translate-x-0`}
                            >
                                <div className="flex items-center justify-between h-16 m-4">
                                    <Image src={logo} alt="" width={200} />
                                </div>
                                <nav className="mt-4">
                                    {LinkItems.map((link) => (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            className="flex items-center px-4 py-2 text-white hover:text-gray-200"
                                        >
                                            <link.icon className="mr-3" />
                                            {link.name}
                                        </Link>
                                    ))}
                                </nav>
                            </div>
                            <Header />
                            <main className="flex-1 p-4 lg:ml-64">{children}</main>
                        </div>
                    </Provider>
                </>
            </body>
        </html>
    );
}
