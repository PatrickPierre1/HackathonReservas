"use client";

import { Button, Fieldset, Flex, Input, Stack, Text } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Agendar({ params }: { params: { id: string } }) {
    const router = useRouter();
    const ambienteId = params.id;
    const usuarioId = localStorage.getItem("unialfa.usuario_id");
    const usuarioNome = localStorage.getItem("unialfa.nome");

    const [ambienteNome, setAmbienteNome] = useState<string | null>(null);
    const [horaInicio, setHoraInicio] = useState<string | null>(null);
    const [horaFim, setHoraFim] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        data_hora_inicio: "",
        data_hora_fim: "",
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const token = localStorage.getItem("unialfa.token");

        if (!token || !ambienteId || !usuarioId) {
            router.replace("/reservas");
            return;
        }

        const fetchAmbienteNome = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/ambientes/${ambienteId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAmbienteNome(response.data.data.nome);
                setHoraInicio(response.data.data.hora_inicio);
                setHoraFim(response.data.data.hora_fim);
            } catch (error) {
                console.error("Erro ao buscar o nome do ambiente:", error);
                setAmbienteNome("Ambiente não encontrado");
            }
        };

        fetchAmbienteNome();
    }, [router, ambienteId, usuarioId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let validationErrors: { [key: string]: string } = {};
        if (!formData.data_hora_inicio) validationErrors.data_hora_inicio = "Data e hora de início são obrigatórias";
        if (!formData.data_hora_fim) validationErrors.data_hora_fim = "Data e hora de fim são obrigatórias";

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const token = localStorage.getItem("unialfa.token");

            const requestData = {
                usuario_id: usuarioId,
                ambiente_id: ambienteId,
                data_hora_inicio: formData.data_hora_inicio,
                data_hora_fim: formData.data_hora_fim,
                status: "2",
            };

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/reservas`, requestData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success("Reserva criada com sucesso!");
            router.push("/reservas");
        } catch (error: any) {
            if (error.response && error.response.data) {
                const apiErrorMessage = error.response.data.mensagem || "Erro ao criar a reserva.";

                // Exibe também o horário disponível do ambiente no erro do toast
                const horarioDisponivel = `Horário disponível: ${horaInicio} às ${horaFim}`;
                toast.error(`${apiErrorMessage} ${horarioDisponivel}`);
            } else {
                toast.error("Erro ao criar a reserva.");
            }

            console.log(error);
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
                                Criando Reserva
                            </Fieldset.Legend>
                            <Fieldset.HelperText>Preencha os campos corretamente</Fieldset.HelperText>
                        </Stack>

                        <Fieldset.Content gap={5}>
                            <Field label="Usuário">
                                <Text
                                    padding={2}
                                    border={"2px"}
                                    borderStyle={"solid"}
                                    borderColor={"gray.200"}
                                    width={"full"}
                                >{usuarioNome || "Usuário não encontrado"}</Text>
                            </Field>

                            <Field label="Ambiente">
                                <Text
                                    padding={2}
                                    border={"2px"}
                                    borderStyle={"solid"}
                                    borderColor={"gray.200"}
                                    width={"full"}
                                >{ambienteNome || "Carregando..."}</Text>
                            </Field>

                            <Field label="Data e Hora de Início">
                                <Input
                                    padding={2}
                                    border={"2px"}
                                    borderStyle={"solid"}
                                    borderColor={"gray.200"}
                                    type="datetime-local"
                                    name="data_hora_inicio"
                                    value={formData.data_hora_inicio}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                                {errors.data_hora_inicio && (
                                    <p className="text-red-500 text-sm mt-1">{errors.data_hora_inicio}</p>
                                )}
                            </Field>

                            <Field label="Data e Hora de Fim">
                                <Input
                                    padding={2}
                                    border={"2px"}
                                    borderStyle={"solid"}
                                    borderColor={"gray.200"}
                                    type="datetime-local"
                                    name="data_hora_fim"
                                    value={formData.data_hora_fim}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                                {errors.data_hora_fim && (
                                    <p className="text-red-500 text-sm mt-1">{errors.data_hora_fim}</p>
                                )}
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
                            Agendar
                        </Button>
                    </Fieldset.Root>
                </form>
            </div>

            <ToastContainer position="bottom-right" autoClose={5000} />
        </>
    );
}
