'use client';

import styles from "./styles.module.css";
import { useState } from 'react';
import {
    FiHome,
    FiSettings,
    FiMenu,
    FiX,
} from 'react-icons/fi';
import { MdOutlineLocationCity } from "react-icons/md";
import { RiCalendarTodoFill } from "react-icons/ri";
import { PiScrollFill } from "react-icons/pi";
import { Button, MenuContent, MenuItem, MenuRoot, MenuTrigger } from "@chakra-ui/react";
import { FaBell } from "react-icons/fa";
import { Avatar } from "@/components/ui/avatar"
import { IoIosArrowDown } from "react-icons/io";

const LinkItems = [
    { name: 'Dashboard', icon: FiHome },
    { name: 'Ambientes', icon: MdOutlineLocationCity },
    { name: 'Reservas', icon: RiCalendarTodoFill },
    { name: 'Históricos', icon: PiScrollFill },
    { name: 'Configurações', icon: FiSettings },
];

export const Header = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            {/* Sidebar */}
            <div
                className={` ${styles.sidebar} fixed inset-y-0 left-0 z-30 w-64 shadow-md transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } transition-transform duration-300 lg:translate-x-0`}
            >
                <div className="flex items-center justify-between h-16 px-4 border-b">
                    <h1 className="text-3xl font-bold text-white">Unialfa</h1>
                    <button
                        className="lg:hidden text-white"
                        onClick={toggleSidebar}
                    >
                        <FiX size={24} />
                    </button>
                </div>
                <nav className="mt-4">
                    {LinkItems.map((link) => (
                        <a
                            key={link.name}
                            href="#"
                            className="flex items-center px-4 py-2 text-white hover:text-gray-200"
                        >
                            <link.icon className="mr-3" />
                            {link.name}
                        </a>
                    ))}
                </nav>
            </div>
            <header className="flex items-center justify-between h-16 px-4 bg-white border-b lg:ml-64">
                <button
                    className="lg:hidden text-gray-600"
                    onClick={toggleSidebar}
                >
                    <FiMenu size={24} />
                </button>
                <h1 className="text-xl font-bold">Dashboard</h1>

                <MenuRoot positioning={{ placement: "bottom" }}>
                    <MenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            <div className="flex flex-row justify-between gap-3 items-center">
                                <Avatar name="Patrick Pierre" src="https://bit.ly/sage-adebayo" size="sm" />
                                <div className="flex flex-col text-start">
                                    <span className="text-md text-gray-800">Patrick Pierre</span>
                                    <span className="text-sm text-gray-400">Admin</span>
                                </div>
                                <IoIosArrowDown />
                            </div>
                        </Button>
                    </MenuTrigger>

                    <MenuContent
                        boxShadow="md"
                        borderRadius="md"
                        bg="white"
                        p="2"
                        minWidth="150px"
                        _focus={{ outline: "none" }}
                        zIndex="popover"
                    >
                        <MenuItem
                            value="logout"
                            color="red.500"
                            _hover={{ bg: "red.50", color: "red.600" }}
                        >
                            Desconectar
                        </MenuItem>
                    </MenuContent>
                </MenuRoot>
            </header>

            <main className="flex-1 p-4 lg:ml-64">
            </main>
        </div>
    );
};
