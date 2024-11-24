import { Metadata } from "next";
import styles from "./styles.module.css";
import "./global.css";
import { Provider } from "@/components/ui/provider";
import { Poppins } from "next/font/google";
import { FiHome, FiSettings } from "react-icons/fi";
import { MdOutlineLocationCity } from "react-icons/md";
import { RiCalendarTodoFill } from "react-icons/ri";
import { PiScrollFill } from "react-icons/pi";
import logo from "../../../public/images/logo.png";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { cookies } from "next/headers"; // Para acessar cookies no lado do servidor

const LinkItems = [
  { name: "Home", icon: FiHome, href: "/" },
  {
    name: "Ambientes",
    icon: MdOutlineLocationCity,
    href: "/ambientes/gerenciar",
    requiresPermission: "Admin", // Permissão necessária
  },
  { name: "Reservas", icon: RiCalendarTodoFill, href: "/reservas" },
  { name: "Históricos", icon: PiScrollFill, href: "/historicos", requiresPermission: "Admin" },
  {
    name: "Configurações",
    icon: FiSettings,
    href: "/configuracoes",
    requiresPermission: "Admin", // Permissão necessária
  },
];

const poppins = Poppins({
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Hackathon",
  description: "Hackathon",
};

// Função para obter permissões dos cookies
function getPermissions() {
  const cookieStore = cookies();
  const permissoes = cookieStore.get("unialfa.permissoes")?.value;

  // Tentar converter em JSON e retornar como array
  try {
    return permissoes ? JSON.parse(permissoes) : [];
  } catch {
    console.error("Erro ao analisar as permissões do cookie.");
    return [];
  }
}

// O componente principal da página
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const permissions = getPermissions(); // Obter permissões no lado do servidor

  return (
    <html lang="en" className={poppins.className}>
      <body suppressHydrationWarning={false}>
        <>
          <Provider>
            <div className="min-h-screen flex flex-col bg-gray-100">
              <div
                className={`${styles.sidebar} fixed inset-y-0 left-0 z-30 w-64 shadow-md transform lg:translate-x-0`}
              >
                <div className="flex items-center justify-between h-16 m-4">
                  <Link href="/">
                    <Image
                      src={logo}
                      alt="Logo"
                      width={200}
                      className="cursor-pointer"
                    />
                  </Link>
                </div>
                <nav className="mt-4">
                  {LinkItems.map((link) => {
                    // Verificar se o link requer permissões específicas
                    if (
                      link.requiresPermission &&
                      !permissions.includes(link.requiresPermission)
                    ) {
                      return null; // Ocultar link se não tiver permissão
                    }

                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        className="flex items-center px-4 py-2 text-white hover:text-gray-200"
                      >
                        <link.icon className="mr-3" />
                        {link.name}
                      </Link>
                    );
                  })}
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
