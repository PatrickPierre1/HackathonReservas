"use client";
import { Box, Text, Grid, Badge, Button, Spinner } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Ambiente {
    id: number;
    nome: string;
    tipo: string;
    status: string;
    descricao: string;
}

export default function Ambientes() {
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
    return (
        <Box bg="gray.100" py={8} px={4} minH="100vh">
            <Text fontSize="3xl" fontWeight="bold" textAlign="center" mb={6}>
                Ambientes Disponíveis
            </Text>

            {isAdmin && (
                <Box className="flex justify-end">
                    <Button onClick={() => router.push(`/ambientes/gerenciar/`)} fontWeight={"medium"} color="white" p="20px" mb="10px" bgColor="#14a548">Gerenciar</Button>
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
                                <Badge
                                    color={"white"}
                                    bgColor={getStatusColor(ambiente.status)}
                                    mb={2}
                                    px={2}
                                    py={1}
                                    borderRadius="md"
                                >
                                    {ambiente.status.charAt(0).toUpperCase() + ambiente.status.slice(1)}
                                </Badge>
                                <Text fontSize="sm" color="gray.600">
                                    {ambiente.descricao}
                                </Text>
                            </Box>
                        </Box>
                    ))}
                </Grid>
            )}
        </Box>
    );
}
