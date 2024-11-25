"use client";

import { Box, Button, HStack, Stack, Table } from "@chakra-ui/react"
import { BsPencilSquare } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    DialogActionTrigger,
    DialogBody,
    DialogCloseTrigger,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Reserva {
    id: number;
    usuario_id: string;
    usuario_nome?: string;
    ambiente_id: string;
    ambiente_nome?: string;
    data_hora_inicio: string;
    data_hora_fim: string;
    status: string;
}

export default function Gerenciar() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('unialfa.token');
        const permissoes = localStorage.getItem('unialfa.permissoes');

        if (!token || permissoes === "Professor") {
            router.replace('/reservas');
        }
    }, [router]);

    const handleDelete = async (id: number) => {
        try {
            const token = localStorage.getItem('unialfa.token');
            if (!token) {
                console.error("Token não encontrado");
                return;
            }

            const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/reservas/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setReservas((prevReservas) => prevReservas.filter((item) => item.id !== id));
                toast.success("Reserva deletada com sucesso!");
            } else {
                throw new Error('Erro ao excluir ambiente');
            }
        } catch (error) {
            console.error("Erro ao excluir ambiente:", error);
            toast.error("Erro ao deletar reserva. Tente novamente mais tarde.");
        }
    };

    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const token = localStorage.getItem('unialfa.token');
                const [reservasRes, usuariosRes, ambientesRes] = await Promise.all([
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/reservas`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/usuarios`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/ambientes`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                const usuariosMap = usuariosRes.data.data.reduce((acc: any, usuario: any) => {
                    acc[usuario.id] = usuario.nome;
                    return acc;
                }, {});

                const ambientesMap = ambientesRes.data.data.reduce((acc: any, ambiente: any) => {
                    acc[ambiente.id] = ambiente.nome;
                    return acc;
                }, {});

                const reservasComNomes = reservasRes.data.data.map((reserva: any) => ({
                    ...reserva,
                    usuario_nome: usuariosMap[reserva.usuario_id] || "Usuário desconhecido",
                    ambiente_nome: ambientesMap[reserva.ambiente_id] || "Ambiente desconhecido",
                }));

                setReservas(reservasComNomes);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, []);
    return (
        <>
            <Stack width="full" gap="5">
                <Table.ScrollArea borderWidth="1px" maxW="screen">
                    <Table.Root size="md" variant="line" striped interactive>
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader fontWeight={"bold"}>Usuario</Table.ColumnHeader>
                                <Table.ColumnHeader fontWeight={"bold"}>Ambiente</Table.ColumnHeader>
                                <Table.ColumnHeader fontWeight={"bold"}>Data e hora inicio</Table.ColumnHeader>
                                <Table.ColumnHeader fontWeight={"bold"}>Data e hora fim</Table.ColumnHeader>
                                <Table.ColumnHeader fontWeight={"bold"}>Status</Table.ColumnHeader>
                                <Table.ColumnHeader fontWeight={"bold"}>Opções</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {reservas.map((item) => (
                                <Table.Row key={item.id}>
                                    <Table.Cell>{item.usuario_nome}</Table.Cell>
                                    <Table.Cell>{item.ambiente_nome}</Table.Cell>

                                    <Table.Cell>{item.data_hora_inicio.toString()}</Table.Cell>
                                    <Table.Cell>{item.data_hora_fim.toString()}</Table.Cell>
                                    <Table.Cell>
                                        {
                                            Number(item.status) === 1 ? "Disponível" :
                                                Number(item.status) === 2 ? "Reservado" :
                                                    Number(item.status) === 3 ? "Manutenção" :
                                                        "Status desconhecido"
                                        }
                                    </Table.Cell>
                                    <Table.Cell>
                                        <DialogRoot placement={"center"} role="alertdialog">
                                            <DialogTrigger asChild>
                                                <Button
                                                    size="sm"
                                                    padding={"8px"}
                                                    bgColor={"red.500"}
                                                >
                                                    <MdDelete color="white" fontSize={"20px"} />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Tem certeza?</DialogTitle>
                                                </DialogHeader>
                                                <DialogBody>
                                                    <p>
                                                        Essa ação não pode ser desfeita. Isso excluirá permanentemente e os dados de nossos sistemas.
                                                    </p>
                                                </DialogBody>
                                                <DialogFooter>
                                                    <DialogActionTrigger asChild>
                                                        <Button variant="outline">Cancelar</Button>
                                                    </DialogActionTrigger>
                                                    <Button onClick={() => handleDelete(item.id)} bgColor="red.500" color={"white"} paddingX={"10px"}>Deletar</Button>
                                                </DialogFooter>
                                                <DialogCloseTrigger />
                                            </DialogContent>
                                        </DialogRoot>

                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </Table.ScrollArea>
            </Stack>
            <ToastContainer position="bottom-right" autoClose={5000} />
        </>
    )
}