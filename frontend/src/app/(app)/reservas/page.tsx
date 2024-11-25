"use client";
import { Box, Text, Grid, Badge, Button, Spinner, Flex, Stack, Table, DialogRoot, DialogCloseTrigger, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogActionTrigger } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdDelete, MdPeopleAlt } from "react-icons/md";
import { TbClockHour3Filled } from "react-icons/tb";
import { FaCalendarXmark, FaComputer } from "react-icons/fa6";

interface Ambiente {
    id: number;
    nome: string;
    tipo: string;
    status: string;
    capacidade: number;
    maquinas_disponiveis: number;
    hora_inicio: string;
    hora_fim: string;
    descricao: string;
}
interface Reserva {
    id: number;
    usuario_nome: string;
    ambiente_nome: string;
    data_hora_inicio: string;
    data_hora_fim: string;
    status: string;
    usuario: {
        nome: string,
    },
    ambiente: {
        nome: string
    }
}

export default function Reservas() {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "1":
                return "green";
            case "2":
                return "orange";
            case "3":
                return "red";
            default:
                return "gray";
        }
    };
    const [ambientes, setAmbientes] = useState<Ambiente[]>([]);
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const router = useRouter();
    const nome = localStorage.getItem('unialfa.nome');
    const permissoes = localStorage.getItem('unialfa.permissoes');
    const isAdmin = localStorage.getItem('unialfa.permissoes') === "Admin";

    useEffect(() => {
        const token = localStorage.getItem('unialfa.token');
        if (!token) {
            router.replace('/login');
        }
    }, [router]);

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

    const fetchReservas = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem("unialfa.token");
            const usuarioId = localStorage.getItem("unialfa.usuario_id");

            if (!usuarioId) {
                throw new Error("Usuário não encontrado. Faça login novamente.");
            }

            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/reservas?usuario_id=${usuarioId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                setReservas(response.data.data || []);
            } else {
                throw new Error("Erro ao buscar reservas.");
            }
        } catch (error) {
            console.error("Erro ao buscar reservas:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReservas();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            const token = localStorage.getItem("unialfa.token");

            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/reservas/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Atualizar estado após exclusão
            setReservas((prev) => prev.filter((reserva) => reserva.id !== id));
        } catch (error) {
            console.error("Erro ao excluir reserva:", error);
        }
    };
    return (
        <>
            <Box bg="gray.100" py={8} px={4} minH="100vh">
                <Text fontSize="3xl" fontWeight="bold" textAlign="center" mb={6}>
                    Reservas Disponíveis
                </Text>

                {isAdmin && (
                    <Box className="flex justify-end">
                        <Button onClick={() => router.push(`/reservas/gerenciar/`)} fontWeight={"medium"} color="white" p="20px" mb="10px" bgColor="#14a548">Gerenciar</Button>
                    </Box>
                )}

                {isLoading ? (
                    <Text textAlign="center" mt={6}>
                        Carregando...
                    </Text>
                ) : (
                    <Grid
                        templateColumns={{
                            base: "repeat(1, 1fr)",
                            sm: "repeat(2, 1fr)",
                            lg: "repeat(3, 1fr)",
                        }}
                        gap={6}
                    >
                        {ambientes.map((ambiente) => (
                            <Box
                                key={ambiente.id}
                                bg="white"
                                shadow="md"
                                borderRadius="md"
                                overflow="hidden"
                                _hover={{ shadow: "lg" }}
                                transition="0.3s"
                            >
                                <Box p={4} borderTop={"lg"} borderColor={"#3c89f5"}>
                                    <Text fontSize="lg" fontWeight="semibold" mb={2}>
                                        {ambiente.nome}
                                    </Text>
                                    <Text fontSize="sm" color="gray.600" mb={2}>
                                        Tipo: {ambiente.tipo}
                                    </Text>
                                    <Flex gap={5}>
                                        <Text className="flex flex-row gap-2 items-center" fontSize="sm" color="gray.600" mb={2}>
                                            <MdPeopleAlt /> {ambiente.capacidade}
                                        </Text>
                                        <Text className="flex flex-row gap-2 items-center" fontSize="sm" color="gray.600" mb={2}>
                                            <FaComputer /> {ambiente.maquinas_disponiveis}
                                        </Text>
                                    </Flex>
                                    <Flex gap={5}>
                                        <Text className="flex flex-row gap-2 items-center" fontSize="sm" color="gray.600" mb={2}>
                                            <TbClockHour3Filled /> {ambiente.hora_inicio}
                                        </Text>
                                        <Text className="flex flex-row gap-2 items-center" fontSize="sm" color="gray.600" mb={2}>
                                            <TbClockHour3Filled /> {ambiente.hora_fim}
                                        </Text>
                                    </Flex>
                                    <Badge
                                        color={"white"}
                                        bgColor={getStatusColor(ambiente.status)}
                                        mb={2}
                                        px={2}
                                        py={1}
                                        borderRadius="md"
                                    >
                                        {
                                            Number(ambiente.status) === 1 ? "Disponível" :
                                                Number(ambiente.status) === 2 ? "Reservado" :
                                                    Number(ambiente.status) === 3 ? "Manutenção" :
                                                        "Status desconhecido"
                                        }
                                    </Badge>
                                    <Text fontSize="sm" color="gray.600">
                                        {ambiente.descricao}
                                    </Text>

                                    {Number(ambiente.status) === 1 && (
                                        <Button
                                            bgColor={"#14a548"}
                                            color={"white"}
                                            width="full"
                                            marginTop={"15px"}
                                            onClick={() => router.push(`/reservas/gerenciar/agendar/${ambiente.id}`)}
                                        >
                                            Agendar
                                        </Button>
                                    )}
                                </Box>
                            </Box>
                        ))}
                    </Grid>
                )}
            </Box>
            <Text fontSize="3xl" fontWeight="bold" textAlign="center" mb={6}>
                Suas Reservas
            </Text>
            <Stack width="full" gap="5">
                <Table.ScrollArea borderWidth="1px" maxW="screen">
                    <Table.Root size="md" variant="line" striped interactive>
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader fontWeight={"bold"}>Nome</Table.ColumnHeader>
                                <Table.ColumnHeader fontWeight={"bold"}>Ambiente</Table.ColumnHeader>
                                <Table.ColumnHeader fontWeight={"bold"}>Data e hora inicio</Table.ColumnHeader>
                                <Table.ColumnHeader fontWeight={"bold"}>Data e hora fim</Table.ColumnHeader>
                                <Table.ColumnHeader fontWeight={"bold"}>Opções</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {reservas.map((item) => (
                                <Table.Row key={item.id}>
                                    <Table.Cell>{item.usuario.nome}</Table.Cell>
                                    <Table.Cell>{item.ambiente.nome}</Table.Cell>
                                    <Table.Cell>{item.data_hora_inicio.toString()}</Table.Cell>
                                    <Table.Cell>{item.data_hora_fim.toString()}</Table.Cell>
                                    <Table.Cell>
                                        <DialogRoot placement={"center"} role="alertdialog">
                                            <DialogTrigger asChild>
                                                <Button
                                                    size="sm"
                                                    padding={"8px"}
                                                    bgColor={"red.500"}
                                                >
                                                    <Flex color={"white"} gap={3}>
                                                        <FaCalendarXmark color="white" />
                                                        <Text>Cancelar reserva</Text>
                                                    </Flex>
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
        </>

    );
}
