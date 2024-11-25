"use client";
import { useState, useEffect } from 'react';
import { Button, Box, Text } from '@chakra-ui/react';
import { MdCancel } from "react-icons/md";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Notification {
    id: number;
    usuario_id: number;
    mensagem: string;
    tipo: string;
    created_at: string;
}

export default function Notifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('unialfa.token');
        const storedUserId = localStorage.getItem('unialfa.usuario_id');

        if (storedToken) setToken(storedToken);
        if (storedUserId) setUserId(Number(storedUserId));
    }, []);

    useEffect(() => {
        if (!token || userId === null) return;

        const fetchNotifications = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/notificacoes`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = response.data;

                if (Array.isArray(data)) {
                    const userNotifications = data.filter((notification: Notification) => notification.usuario_id === userId);
                    setNotifications(userNotifications);
                } else if (data.mensagem) {
                    console.error("Erro da API:", data.mensagem);
                }
            } catch (error) {
                console.error("Erro ao buscar notificações:", error);
            }
        };

        fetchNotifications();
    }, [token, userId]);

    const cancelAppointment = async () => {
        if (!selectedNotification || !token) return;

        try {
            // Cancelar a notificação
            const notificationResponse = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/notificacoes/${selectedNotification.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (notificationResponse.status === 200) {

                const reservaId = selectedNotification.tipo === "reserva" ? selectedNotification.id : null;

                if (reservaId) {
                    const reservaResponse = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/reservas/${reservaId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (reservaResponse.status !== 200) {
                        throw new Error('Erro ao cancelar a reserva');
                    }
                }

                // Remover notificação da lista
                setNotifications((prevNotifications) =>
                    prevNotifications.filter((notification) => notification.id !== selectedNotification.id)
                );

                toast.success("Notificação e reserva canceladas com sucesso!");
            } else {
                throw new Error('Erro ao cancelar a notificação');
            }
        } catch (error) {
            toast.error("Erro ao cancelar a notificação ou reserva.");
            console.error("Erro ao cancelar a notificação ou reserva:", error);
        }
    };

    return (
        <Box>
            {notifications.length > 0 ? (
                notifications.map((notification) => (
                    <Box
                        key={notification.id}
                        borderWidth="1px"
                        borderRadius="lg"
                        p="4"
                        mb="4"
                        bg="white"
                        shadow="sm"
                        display="flex"
                        flexDirection={["column", "row"]} // Ajuste para coluna em telas menores
                        justifyContent="space-between"
                        alignItems="center"
                        bgColor={"blue.300"}
                    >
                        <Text fontWeight="bold" fontSize="lg" flex="1" mb={["2", "0"]}>
                            {notification.mensagem}
                        </Text>
                        <Text fontWeight="bold" fontSize="lg" flex="1" mb={["2", "0"]}>
                            {notification.tipo}
                        </Text>
                        <Button
                            bgColor={"red.500"}
                            padding={"4px"}
                            color={"white"}
                            size="md"
                            rounded={"full"}
                            onClick={() => {
                                setSelectedNotification(notification);
                                cancelAppointment();
                            }}
                        >
                            <MdCancel color="white" />
                        </Button>
                    </Box>
                ))
            ) : (
                <Text>Não há notificações.</Text>
            )}
        </Box>
    );
}
