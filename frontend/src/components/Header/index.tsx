"use client";
import { Box, Collapsible, Text } from "@chakra-ui/react";
import { Avatar } from "@/components/ui/avatar";
import Link from "next/link";
import { FaBell } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { usePathname } from "next/navigation";
import { FiSettings } from "react-icons/fi";
import { FaSignOutAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";

export const Header = () => {
    const [nome, setNome] = useState<string | null>(null);
    const [permissoes, setPermissoes] = useState<string | null>(null);
    const [notificationCount, setNotificationCount] = useState<number>(0);

    const pathname = usePathname();
    const formattedTitle = pathname
        .replace("/", "")
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

    useEffect(() => {
        if (typeof window !== "undefined") {
            const nomeLocal = localStorage.getItem("unialfa.nome");
            const permissoesLocal = localStorage.getItem("unialfa.permissoes");

            setNome(nomeLocal);
            setPermissoes(permissoesLocal);
        }
    }, []);
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem("unialfa.token");
                const userId = localStorage.getItem("unialfa.usuario_id"); // Obtém o ID do usuário logado

                if (!userId) {
                    console.error("ID do usuário não encontrado.");
                    return;
                }

                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/notificacoes`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.status !== 200) {
                    console.error("Erro ao buscar notificações", response.status);
                    return;
                }

                const data = response.data;

                if (!Array.isArray(data)) {
                    console.error("A resposta da API não é um array:", data);
                    return;
                }
                const userNotifications = data.filter(
                    (notification: { usuario_id: number }) =>
                        notification.usuario_id === parseInt(userId, 10)
                );
                setNotificationCount(userNotifications.length);
            } catch (error) {
                console.error("Erro ao buscar notificações:", error);
            }
        };

        fetchNotifications();
    }, []);

    return (
        <>
            <header className="flex items-center justify-between h-16 px-4 bg-white border-b lg:ml-64">
                <h1 className="text-xl font-bold">{formattedTitle}</h1>
                <div className="flex flex-row gap-3 items-center">
                    <Link href={"/notificacao"} className="relative p-3 bg-gray-100 rounded-full">
                        <FaBell size={20} className="hover:text-blue-500" />
                        {notificationCount > 0 && (
                            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {notificationCount}
                            </span>
                        )}
                    </Link>
                    <Collapsible.Root >
                        <Collapsible.Trigger >
                            <div className="flex items-center gap-3">
                                <Avatar
                                    name={nome?.toString()}
                                    src=""
                                    size="sm"
                                />
                                <div className="flex flex-col text-start">
                                    <span className="text-md text-gray-800">{nome}</span>
                                    <span className="text-sm text-gray-400">{permissoes}</span>
                                </div>
                                <IoIosArrowDown />
                            </div>
                        </Collapsible.Trigger>
                        <Collapsible.Content right="5" position="absolute" flex="auto" zIndex={999}>
                            <Box padding="3" borderWidth="1px" bgColor="white" color="black" borderRadius="md">
                                <Link
                                    className="text-red-500 flex flex-row items-center gap-3"
                                    href={"/login"}
                                    onClick={() => {
                                        localStorage.removeItem("unialfa.token");
                                        localStorage.removeItem("unialfa.nome");
                                        localStorage.removeItem("unialfa.permissoes");
                                    }}
                                >
                                    <FaSignOutAlt /> Desconectar
                                </Link>
                            </Box>
                        </Collapsible.Content>
                    </Collapsible.Root>
                </div>
            </header>
        </>
    );
};
