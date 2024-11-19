"use client";
import { Box, Collapsible, Text } from "@chakra-ui/react"
import { Avatar } from "@/components/ui/avatar";
import Link from "next/link"
import { FaBell } from "react-icons/fa6"
import { IoIosArrowDown } from "react-icons/io"
import { usePathname } from 'next/navigation';

export const Header = () => {
    const pathname = usePathname();
    const formattedTitle = pathname
        .replace('/', '')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());

    return (
        <>
            <header className="flex items-center justify-between h-16 px-4 bg-white border-b lg:ml-64">
                <h1 className="text-xl font-bold">{formattedTitle}</h1>
                <div className="flex flex-row gap-3 items-center">
                    <Link href={"/notificacao"} className="p-3 bg-gray-100 rounded-full">
                        <FaBell size={20} className="hover:text-blue-500" />
                    </Link>
                    <Collapsible.Root>
                        <Collapsible.Trigger>
                            <div className="flex items-center gap-3">
                                <Avatar name="Patrick Pierre" src="" size="sm" />
                                <div className="flex flex-col text-start">
                                    <span className="text-md text-gray-800">Patrick Pierre</span>
                                    <span className="text-sm text-gray-400">Admin</span>
                                </div>
                                <IoIosArrowDown />
                            </div>
                        </Collapsible.Trigger>
                        <Collapsible.Content right="5" position="absolute" flex="auto">
                            <Box padding="3" borderWidth="1px" bgColor="white" color="black" borderRadius="md">
                                <Text cursor="pointer" color="red.400">Desconectar</Text>
                            </Box>
                        </Collapsible.Content>
                    </Collapsible.Root>
                </div>
            </header>
        </>
    )
}