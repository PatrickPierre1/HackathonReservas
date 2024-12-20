"use client";

import { Box, Button, HStack, Stack, Table } from "@chakra-ui/react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BsPencilSquare } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { FiPlus } from 'react-icons/fi';
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

interface Ambiente {
    id: number;
    nome: string;
    tipo: string;
    status: string;
    descricao: string;
    capacidade: string;
    maquinas_disponiveis: string;
    hora_inicio: string;
    hora_fim: string;
}

export default function Gerenciar() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('unialfa.token');
        const permissoes = localStorage.getItem('unialfa.permissoes');


        if (!token || permissoes === "Professor") {
            router.replace('/login');
        }
    }, [router]);

    const handleEdit = (id: number) => {
        router.push(`/ambientes/gerenciar/editar/${id}`);
    };

    const handleDelete = async (id: number) => {
        try {
            const token = localStorage.getItem('unialfa.token');
            if (!token) {
                console.error("Token não encontrado");
                return;
            }

            const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/ambientes/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setAmbientes((prevAmbientes) => prevAmbientes.filter((item) => item.id !== id));
                toast.success("Ambiente deletado com sucesso!");
            } else {
                throw new Error('Erro ao excluir ambiente');
            }
        } catch (error) {
            console.error("Erro ao excluir o ambiente:", error);
            toast.error("Erro ao deletar ambiente. Tente novamente mais tarde.");
        }
    };

    const [ambientes, setAmbientes] = useState<Ambiente[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchAmbientes() {
            try {
                const token = localStorage.getItem('unialfa.token');
                const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + "/ambientes", {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 200) {
                    setAmbientes(Array.isArray(response.data.data) ? response.data.data : []);
                } else {
                    throw new Error('Erro ao buscar ambientes');
                }
            } catch (error) {
                console.error('Erro:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchAmbientes();
    }, []);
    return (
        <>
            <Stack width="full" gap="5">
                <Box className="flex justify-start">
                    <Button onClick={() => router.push(`/ambientes/gerenciar/criar`)} bgColor={"green.500"} padding={"10px"} color={"white"} variant={"outline"}> <FiPlus />Adicionar</Button>
                </Box>
                <Table.ScrollArea borderWidth="1px" maxW="screen">
                    <Table.Root size="lg" variant="line" striped interactive>
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader>Nome</Table.ColumnHeader>
                                <Table.ColumnHeader>Tipo</Table.ColumnHeader>
                                <Table.ColumnHeader>Status</Table.ColumnHeader>
                                <Table.ColumnHeader>Descrição</Table.ColumnHeader>
                                <Table.ColumnHeader>Capacidade</Table.ColumnHeader>
                                <Table.ColumnHeader>Maquinas Disponiveis</Table.ColumnHeader>
                                <Table.ColumnHeader>Hora de inicio</Table.ColumnHeader>
                                <Table.ColumnHeader>Hora do fim</Table.ColumnHeader>
                                <Table.ColumnHeader>Opções</Table.ColumnHeader>

                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {ambientes.map((item) => (
                                <Table.Row key={item.id}>
                                    <Table.Cell>{item.nome}</Table.Cell>
                                    <Table.Cell>{item.tipo}</Table.Cell>
                                    <Table.Cell>{item.status}</Table.Cell>
                                    <Table.Cell>{item.descricao}</Table.Cell>
                                    <Table.Cell>{item.capacidade}</Table.Cell>
                                    <Table.Cell>{item.maquinas_disponiveis}</Table.Cell>
                                    <Table.Cell>{item.hora_inicio}</Table.Cell>
                                    <Table.Cell>{item.hora_fim}</Table.Cell>
                                    <Table.Cell>
                                        <Button
                                            size="sm"
                                            onClick={() => handleEdit(item.id)}
                                            className="mr-2"
                                            padding={"8px"}
                                            bgColor={"#3c89f5"}
                                        >
                                            <BsPencilSquare color="white" fontSize={"20px"} />
                                        </Button>

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
            <ToastContainer />
        </>
    )
}