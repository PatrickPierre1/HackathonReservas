"use client";

import { Button, Fieldset, Flex, Input, Stack, Textarea } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { toaster } from "@/components/ui/toaster";

export default function Atualizar({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        nome: "",
        tipo: "",
        descricao: "",
        status: "1",
        capacidade: null,
        maquinas_disponiveis: null,
        hora_inicio: null,
        hora_fim: null,
    });

    const [loading, setLoading] = useState(true); // Estado de carregamento

    useEffect(() => {
        const token = localStorage.getItem("unialfa.token");
        const permissoes = localStorage.getItem("unialfa.permissoes");

        if (!token || permissoes === "Professor") {
            router.replace("/ambientes");
        } else {
            fetchAmbiente(params.id);
        }
    }, [router, params.id]);

    const fetchAmbiente = async (id: string) => {
        try {
            const token = localStorage.getItem("unialfa.token");
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/ambientes/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setFormData(response.data.data); // Atualiza o estado com os dados recebidos
            setLoading(false); // Atualiza o estado de carregamento após os dados serem carregados
        } catch (error) {
            toaster.create({ description: "Erro ao buscar ambiente", type: "error" });
            console.error("Erro ao buscar ambiente:", error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const formatTime = (time: string | null) => {
        if (!time) return null;
        const [hours, minutes] = time.split(":");
        return `${hours}:${minutes}:00`; // Adicionando segundos (00)
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("unialfa.token");

            const formattedData = {
                ...formData,
                hora_inicio: formatTime(formData.hora_inicio),
                hora_fim: formatTime(formData.hora_fim),
            };

            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/ambientes/${params.id}`, formattedData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            toaster.create({ description: "Ambiente atualizado com sucesso", type: "success" });
            console.log("Ambiente atualizado com sucesso:", response.data);
            router.push("/ambientes");
        } catch (error) {
            toaster.create({ description: "Erro ao atualizar ambiente", type: "error" });
            console.error("Erro ao atualizar ambiente:", error);
        }
    };

    // Exibe um carregamento enquanto os dados não são carregados
    if (loading) {
        return <div>Carregando...</div>;
    }

    return (
        <div className="flex justify-center items-center mt-4">
            <form style={{ width: "700px" }} onSubmit={handleSubmit}>
                <Fieldset.Root
                    style={{ boxShadow: "0px 0px 40px 8px rgba(0,0,0,0.1)" }}
                    size="sm"
                    maxW="xl"
                    bg={"#fff"}
                    padding={8}
                    borderRadius={8}
                >
                    <Stack>
                        <Fieldset.Legend fontWeight={"bold"} fontSize={"xl"}>
                            Atualizando Ambiente
                        </Fieldset.Legend>
                        <Fieldset.HelperText>Por favor, revise os dados antes de atualizar</Fieldset.HelperText>
                    </Stack>

                    <Fieldset.Content>
                        <Field label="Nome">
                            <Input
                                padding={2}
                                border={"2px"}
                                borderStyle={"solid"}
                                borderColor={"gray.200"}
                                name="nome"
                                value={formData.nome}
                                onChange={handleInputChange}
                            />
                        </Field>
                        <Flex gap={5}>
                            <Field label="Tipo">
                                <Input
                                    padding={2}
                                    border={"2px"}
                                    borderStyle={"solid"}
                                    borderColor={"gray.200"}
                                    name="tipo"
                                    value={formData.tipo}
                                    onChange={handleInputChange}
                                />
                            </Field>

                            <Field label="Status">
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    style={{
                                        padding: "8px",
                                        border: "2px solid gray",
                                        borderRadius: "4px",
                                        width: "100%",
                                    }}
                                >
                                    <option value="1">Disponível</option>
                                </select>
                            </Field>
                        </Flex>

                        <Flex gap={5}>
                            <Field label="Capacidade">
                                <Input
                                    padding={2}
                                    border={"2px"}
                                    borderStyle={"solid"}
                                    borderColor={"gray.200"}
                                    name="capacidade"
                                    value={formData.capacidade || ""}
                                    onChange={handleInputChange}
                                    type="number"
                                />
                            </Field>

                            <Field label="Máquinas Disponíveis">
                                <Input
                                    padding={2}
                                    border={"2px"}
                                    borderStyle={"solid"}
                                    borderColor={"gray.200"}
                                    name="maquinas_disponiveis"
                                    value={formData.maquinas_disponiveis || ""}
                                    onChange={handleInputChange}
                                    type="number"
                                />
                            </Field>
                        </Flex>

                        <Flex gap={5}>
                            <Field label="Hora Início">
                                <Input
                                    padding={2}
                                    border={"2px"}
                                    borderStyle={"solid"}
                                    borderColor={"gray.200"}
                                    name="hora_inicio"
                                    value={formData.hora_inicio || ""}
                                    onChange={handleInputChange}
                                    type="time"
                                />
                            </Field>

                            <Field label="Hora Fim">
                                <Input
                                    padding={2}
                                    border={"2px"}
                                    borderStyle={"solid"}
                                    borderColor={"gray.200"}
                                    name="hora_fim"
                                    value={formData.hora_fim || ""}
                                    onChange={handleInputChange}
                                    type="time"
                                />
                            </Field>
                        </Flex>
                        <Field label="Descrição">
                            <Textarea
                                height={"100px"}
                                border={"2px"}
                                borderStyle={"solid"}
                                borderColor={"gray.200"}
                                name="descricao"
                                value={formData.descricao}
                                onChange={handleInputChange}
                            />
                        </Field>
                    </Fieldset.Content>

                    <Button
                        marginTop={10}
                        backgroundColor={"#3c89f5"}
                        padding={5}
                        color={"white"}
                        type="submit"
                        alignSelf="flex-end"
                    >
                        Atualizar
                    </Button>
                </Fieldset.Root>
            </form>
        </div>
    );
}
