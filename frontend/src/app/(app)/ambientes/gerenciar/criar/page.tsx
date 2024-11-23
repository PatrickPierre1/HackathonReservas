"use client";

import { Button, Fieldset, Flex, Input, Stack, Textarea } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Criar() {
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

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState<"success" | "error">("success");

    useEffect(() => {
        const token = localStorage.getItem("unialfa.token");
        const permissoes = localStorage.getItem("unialfa.permissoes");

        if (!token || permissoes === "Professor") {
            router.replace("/login");
        }
    }, [router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors((prev) => ({ ...prev, [name]: "" })); // Limpar o erro ao digitar
    };

    const formatTime = (time: string | null) => {
        if (!time) return null;
        const [hours, minutes] = time.split(":");
        return `${hours}:${minutes}:00`; // Adicionando segundos (00)
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validar os campos
        let validationErrors: { [key: string]: string } = {};

        if (!formData.nome) validationErrors.nome = "Nome é obrigatório";
        if (!formData.tipo) validationErrors.tipo = "Tipo é obrigatório";
        if (!formData.descricao) validationErrors.descricao = "Descrição é obrigatória";
        if (!formData.capacidade) validationErrors.capacidade = "Capacidade é obrigatória";
        if (!formData.maquinas_disponiveis) validationErrors.maquinas_disponiveis = "Máquinas disponíveis são obrigatórias";
        if (!formData.hora_inicio) validationErrors.hora_inicio = "Hora de início é obrigatória";
        if (!formData.hora_fim) validationErrors.hora_fim = "Hora de fim é obrigatória";

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const token = localStorage.getItem("unialfa.token");

            const formattedData = {
                ...formData,
                hora_inicio: formatTime(formData.hora_inicio),
                hora_fim: formatTime(formData.hora_fim),
            };

            const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + "/ambientes", formattedData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setToastMessage("Ambiente criado com sucesso");
            setToastType("success");
            setShowToast(true);
            console.log("Ambiente criado com sucesso:", response.data);
            router.push("/ambientes/gerenciar");
        } catch (error) {
            setToastMessage("Erro ao criar o ambiente");
            setToastType("error");
            setShowToast(true);
            console.error("Erro ao criar ambiente:", error);
        }
    };

    return (
        <>
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
                                Criando Ambientes
                            </Fieldset.Legend>
                            <Fieldset.HelperText>Por favor preencha corretamente</Fieldset.HelperText>
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
                                    className="w-full"
                                />
                                {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome}</p>}
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
                                        className="w-full"
                                    />
                                    {errors.tipo && <p className="text-red-500 text-sm mt-1">{errors.tipo}</p>}
                                </Field>

                                <Field label="Status">
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="p-2 border-2 border-gray-200 w-full"
                                    >
                                        <option value="1">Disponível</option>
                                    </select>
                                    {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
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
                                        className="w-full"
                                    />
                                    {errors.capacidade && <p className="text-red-500 text-sm mt-1">{errors.capacidade}</p>}
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
                                        className="w-full"
                                    />
                                    {errors.maquinas_disponiveis && <p className="text-red-500 text-sm mt-1">{errors.maquinas_disponiveis}</p>}
                                </Field>
                            </Flex>

                            <Flex gap={5}>
                                <Field label="Hora de Início">
                                    <Input
                                        padding={2}
                                        border={"2px"}
                                        borderStyle={"solid"}
                                        borderColor={"gray.200"}
                                        name="hora_inicio"
                                        value={formData.hora_inicio || ""}
                                        onChange={handleInputChange}
                                        type="time"
                                        className="w-full"
                                    />
                                    {errors.hora_inicio && <p className="text-red-500 text-sm mt-1">{errors.hora_inicio}</p>}
                                </Field>

                                <Field label="Hora do Fim">
                                    <Input
                                        padding={2}
                                        border={"2px"}
                                        borderStyle={"solid"}
                                        borderColor={"gray.200"}
                                        name="hora_fim"
                                        value={formData.hora_fim || ""}
                                        onChange={handleInputChange}
                                        type="time"
                                        className="w-full"
                                    />
                                    {errors.hora_fim && <p className="text-red-500 text-sm mt-1">{errors.hora_fim}</p>}
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
                                    className="w-full"
                                />
                                {errors.descricao && <p className="text-red-500 text-sm mt-1">{errors.descricao}</p>}
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
                            Enviar
                        </Button>
                    </Fieldset.Root>
                </form>
            </div>

            {showToast && (
                <div
                    className={`fixed top-5 right-5 w-80 p-4 rounded-md shadow-lg text-white ${toastType === "success" ? "bg-green-500" : "bg-red-500"
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <span>{toastMessage}</span>
                        <button onClick={() => setShowToast(false)}>&times;</button>
                    </div>
                </div>
            )}
        </>
    );
}
