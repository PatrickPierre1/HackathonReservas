"use client";
import { Button, Fieldset, Flex, Input, Stack } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toaster } from "@/components/ui/toaster";

export default function Editar({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        senha: "",
        confirmarSenha: "",  // Adicionado o campo confirmar senha
        permissoes: "",
    });
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState<{ [key: string]: string }>({}); // Para armazenar erros de validação

    useEffect(() => {
        const token = localStorage.getItem("unialfa.token");
        const permissoes = localStorage.getItem("unialfa.permissoes");

        if (!token || permissoes === "Professor") {
            router.replace("/reservas");
        } else {
            fetchData(params.id);
        }
    }, [router, params.id]);

    const fetchData = async (id: string) => {
        try {
            const token = localStorage.getItem("unialfa.token");
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setFormData(response.data.data); // Atualiza os dados recebidos
            setLoading(false); // Concluído o carregamento
        } catch (error) {
            toaster.create({ description: "Erro ao carregar dados", type: "error" });
            console.error("Erro ao carregar dados:", error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validação de campos
        let validationErrors: { [key: string]: string } = {};

        if (!formData.senha) validationErrors.senha = "Senha é obrigatória";
        if (formData.senha !== formData.confirmarSenha) validationErrors.confirmarSenha = "As senhas não coincidem";

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const token = localStorage.getItem("unialfa.token");
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${params.id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            toaster.create({ description: "Dados atualizados com sucesso", type: "success" });
            router.push("/configuracoes");
        } catch (error) {
            toaster.create({ description: "Erro ao atualizar dados", type: "error" });
            console.error("Erro ao atualizar dados:", error);
        }
    };

    const handleCancel = () => {
        router.back(); // Volta para a tela anterior
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    return (
        <div className="flex justify-center items-center mt-32">
            <form onSubmit={handleSubmit}>
                <Fieldset.Root
                    style={{ boxShadow: "0px 0px 40px 8px rgba(0,0,0,0.1)" }}
                    size="md"
                    maxW="2xl"
                    bg={"#fff"}
                    padding={8}
                    borderRadius={8}
                >
                    <Stack>
                        <Fieldset.Legend fontWeight={"bold"} fontSize={"xl"}>
                            Editar Usuário
                        </Fieldset.Legend>
                        <Fieldset.HelperText>Por favor, preencha corretamente</Fieldset.HelperText>
                    </Stack>

                    <Fieldset.Content>
                        <Field label="Nome">
                            <Input
                                padding={2}
                                border={"2px"}
                                borderStyle={"solid"}
                                borderColor={"gray.400"}
                                borderRadius={4}
                                name="nome"
                                value={formData.nome}
                                onChange={handleInputChange}
                            />
                        </Field>

                        <Field label="E-mail">
                            <Input
                                padding={2}
                                border={"2px"}
                                borderStyle={"solid"}
                                borderColor={"gray.400"}
                                borderRadius={4}
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </Field>

                        <Field label="Senha">
                            <Input
                                type="password"
                                padding={2}
                                border={"2px"}
                                width={"400px"}
                                borderStyle={"solid"}
                                borderColor={"gray.400"}
                                borderRadius={4}
                                name="senha"
                                value={formData.senha}
                                onChange={handleInputChange}
                            />
                            {errors.senha && <p className="text-red-500 text-sm mt-1">{errors.senha}</p>}
                        </Field>

                        <Field label="Confirmar Senha">
                            <Input
                                type="password"
                                padding={2}
                                border={"2px"}
                                width={"400px"}
                                borderStyle={"solid"}
                                borderColor={"gray.400"}
                                borderRadius={4}
                                name="confirmarSenha"
                                value={formData.confirmarSenha}
                                onChange={handleInputChange}
                            />
                            {errors.confirmarSenha && <p className="text-red-500 text-sm mt-1">{errors.confirmarSenha}</p>}
                        </Field>

                        <Field label="Permissão">
                            <select
                                name="permissoes"
                                value={formData.permissoes || ""}
                                onChange={handleInputChange}
                                className="p-2 border-2 border-gray-400 rounded w-full"
                            >
                                <option value="">Selecione uma permissão</option>
                                <option value="Admin">Admin</option>
                                <option value="Professor">Professor</option>
                            </select>
                        </Field>
                    </Fieldset.Content>

                    <Flex justify="space-between" marginTop={10} gap={4}>
                        <Button
                            backgroundColor="red.500"
                            padding={5}
                            color="white"
                            onClick={handleCancel}
                        >
                            Cancelar
                        </Button>
                        <Button
                            backgroundColor="#3c89f5"
                            padding={5}
                            color="white"
                            type="submit"
                        >
                            Atualizar
                        </Button>
                    </Flex>
                </Fieldset.Root>
            </form>
        </div>
    );
}
