import { Box, Image, Text, Flex, Grid, Badge, Button } from "@chakra-ui/react";

// src/data/ambientes.ts
export const ambientes = [
    {
        id: 1,
        nome: "Biblioteca",
        tipo: "Espaço de Estudo",
        status: "disponível",
        descricao: "Espaço para leitura e estudo."
    },
    {
        id: 2,
        nome: "Salas",
        tipo: "Sala de Reunião",
        status: "reservado",
        descricao: "Salas para reuniões e aulas."
    },
    {
        id: 3,
        nome: "AlphaLAB",
        tipo: "Laboratório",
        status: "manutenção",
        descricao: "Laboratório de tecnologia e inovação."
    },
    {
        id: 4,
        nome: "Auditório",
        tipo: "Espaço para Eventos",
        status: "disponível",
        descricao: "Espaço para eventos e apresentações."
    },
];


export default function Ambientes() {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "disponível":
                return "green";
            case "reservado":
                return "orange";
            case "manutenção":
                return "red";
            default:
                return "gray";
        }
    };

    return (
        <Box bg="gray.100" py={8} px={4} minH="100vh">
            <Text fontSize="3xl" fontWeight="bold" textAlign="center" mb={6}>
                Ambientes Disponíveis
            </Text>
            <Box className="flex justify-end">
                <Button fontWeight={"medium"} color="white" p="20px" mb="10px" bgColor="#14a548">Adicionar</Button>
            </Box>
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
        </Box>
    );
}
