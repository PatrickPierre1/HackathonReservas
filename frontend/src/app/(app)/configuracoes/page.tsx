"use client";

import { Box, Button, HStack, Stack, Table } from "@chakra-ui/react";
import {
    PaginationItems,
    PaginationNextTrigger,
    PaginationPrevTrigger,
    PaginationRoot,
} from "@/components/ui/pagination";
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
} from "@/components/ui/dialog";

interface Usuario {
    id: number;
    nome: string;
    email: string;
    permissoes: string;
}

export default function Configuracoes() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('unialfa.token');
        const permissoes = localStorage.getItem('unialfa.permissoes');

        if (!token || permissoes === "Professor") {
            router.replace('/configuracoes');
        }
    }, [router]);

    const handleEdit = (id: number) => {
        router.push(`/configuracoes/${id}`);
    };

    const handleDelete = (id: number) => {
        console.log(`Excluir Usuario com ID: ${id}`);
    };

    const [usuarios, setUsuarios] = useState<Usuario[]>([]);  // Renomeado para setUsuarios
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchUsuarios() {
            try {
                const response = await fetch("/api/usuarios");
                if (!response.ok) {
                    throw new Error("Erro ao buscar usuarios");
                }
                const data = await response.json();
                setUsuarios(data);  // Corrigido: usa setUsuarios para atualizar o estado
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchUsuarios();
    }, []);

    return (
        <>
            <Stack width="full" gap="5">
                <Box className="flex justify-start">
                    <Button onClick={() => router.push(`/configuracoes/criar`)} bgColor={"green.500"} padding={"10px"} color={"white"} variant={"outline"}> <FiPlus />Adicionar</Button>
                </Box>
                <Table.Root variant="line" colorScheme="teal" className="table-striped">
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader>Nome</Table.ColumnHeader>
                            <Table.ColumnHeader>E-mail</Table.ColumnHeader>
                            <Table.ColumnHeader>Permissão</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {usuarios.map((item) => (
                            <Table.Row key={item.id}>
                                <Table.Cell>{item.nome}</Table.Cell>
                                <Table.Cell>{item.email}</Table.Cell>
                                <Table.Cell>{item.permissoes}</Table.Cell>
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


                <div className="flex justify-end">
                    <PaginationRoot count={usuarios.length * 5} pageSize={5} page={1}>
                        <HStack wrap="wrap">
                            <PaginationPrevTrigger />
                            <PaginationItems />
                            <PaginationNextTrigger />
                        </HStack>
                    </PaginationRoot>
                </div>
            </Stack>
        </>
    );
}
