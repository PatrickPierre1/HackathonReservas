"use client";
import { useState, useEffect } from 'react';
import { Button, Box, Text } from '@chakra-ui/react';
import { FaCalendarXmark } from "react-icons/fa6";
import axios from 'axios';

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
    const [token, setToken] = useState<string | null>(null);  // Armazena o token (você pode definir de onde ele vem)
    const [userId, setUserId] = useState<number | null>(null);

    // Obtendo o token e o ID do usuário do localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem('unialfa.token');
        const storedUserId = localStorage.getItem('unialfa.usuario_id');

        if (storedToken) setToken(storedToken);
        if (storedUserId) setUserId(Number(storedUserId)); // Converte o ID para número
    }, []);

    // Fetch notifications from API
    useEffect(() => {
        if (!token || userId === null) return; // Se o token ou o ID do usuário não estiver disponível, não faz a requisição

        const fetchNotifications = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/notificacoes`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = response.data;

                // Filtra as notificações para exibir apenas as do usuário logado
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
    }, [token, userId]); // Recarrega as notificações sempre que o token ou userId mudar

    // Function to handle appointment cancellation
    const cancelAppointment = async () => {
        if (!selectedNotification || !token) return;

        try {
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/notificacoes/${selectedNotification.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setNotifications((prevNotifications) =>
                    prevNotifications.filter((notification) => notification.id !== selectedNotification.id)
                );
            } else {
                throw new Error('Erro ao cancelar o agendamento');
            }
        } catch (error) {
            console.error("Erro ao cancelar a notificação:", error);
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
                            padding={"7px"}
                            color={"white"}
                            size="sm"
                            onClick={() => {
                                setSelectedNotification(notification);
                                cancelAppointment();
                            }}
                        >
                            <FaCalendarXmark color="white" /> Cancelar Reserva
                        </Button>
                    </Box>
                ))
            ) : (
                <Text>Não há notificações.</Text>
            )}
        </Box>
    );
}
