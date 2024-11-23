"use client";

import { Button, Fieldset, Input, Stack, Flex } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Criar() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        senha: "",
        confirmSenha: "",
        permissoes: "",
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState<"success" | "error">("success");

    useEffect(() => {
        const token = localStorage.getItem("unialfa.token");
        const permissoes = localStorage.getItem("unialfa.permissoes");

        if (!token || permissoes === "Professor") {
            router.replace("/configuracoes");
        }
    }, [router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors((prev) => ({ ...prev, [name]: "" })); // Limpar erro ao digitar
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validar os campos
        let validationErrors: { [key: string]: string } = {};
        
        if (!formData.nome) validationErrors.name = "Nome é obrigatório";
        if (!formData.email) validationErrors.email = "E-mail é obrigatório";
        if (!formData.senha) validationErrors.senha = "Senha é obrigatória";
        if (!formData.permissoes) validationErrors.permissoes = "Permissão é obrigatória";
        if (formData.senha !== formData.confirmSenha) validationErrors.confirmSenha = "As senhas não coincidem";

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const token = localStorage.getItem("unialfa.token");

            const response = await axios.post(
                process.env.NEXT_PUBLIC_API_URL + "/usuarios",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setToastMessage("Usuário criado com sucesso!");
            setToastType("success");
            setShowToast(true);
            console.log("Usuário criado com sucesso:", response.data);
        } catch (error) {
            setToastMessage("Erro ao criar usuário");
            setToastType("error");
            setShowToast(true);
            console.error("Erro ao criar usuário:", error);
        }
    };

    const handleCancel = () => {
        router.push("/configuracoes");
    };

    const handleOk = () => {
        // Quando clicar em "OK", redireciona para a página de configurações
        router.push("/configuracoes");
    };

    return (
        <>
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
                                Criando Usuários
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
                                    name="nome"
                                    value={formData.nome}
                                    onChange={handleInputChange}
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                            </Field>

                            <Field label="E-mail">
                                <Input
                                    padding={2}
                                    border={"2px"}
                                    borderStyle={"solid"}
                                    borderColor={"gray.400"}
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </Field>

                            <Field label="Senha">
                                <Input
                                    type="password"
                                    padding={2}
                                    border={"2px"}
                                    width={"400px"}
                                    borderStyle={"solid"}
                                    borderColor={"gray.400"}
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
                                    name="confirmSenha"
                                    value={formData.confirmSenha}
                                    onChange={handleInputChange}
                                />
                                {errors.confirmSenha && <p className="text-red-500 text-sm mt-1">{errors.confirmSenha}</p>}
                            </Field>

                            <Field label="Permissão">
                                <select
                                    name="permissoes"
                                    value={formData.permissoes || ""}
                                    onChange={handleInputChange}
                                    className="p-2 border-2 border-gray-400 w-full"
                                >
                                    <option value="">Selecione uma permissão</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Professor">Professor</option>
                                </select>
                                {errors.permissoes && <p className="text-red-500 text-sm mt-1">{errors.permissoes}</p>}
                            </Field>
                        </Fieldset.Content>

                        <Flex justify="space-between" marginTop={10} gap={4}>
                            <Button
                                backgroundColor="red.500"
                                padding={5}
                                color="white"
                                width="150px"
                                onClick={handleCancel}
                            >
                                Cancelar
                            </Button>

                            <Button
                                backgroundColor="#3c89f5"
                                padding={5}
                                color="white"
                                width="150px"
                                type="submit"
                                onClick={handleOk}
                            >
                                Criar
                            </Button>
                        </Flex>
                    </Fieldset.Root>
                </form>
            </div>

            {showToast && (
                <div
                    className={`fixed top-5 right-5 w-80 p-4 rounded-md shadow-lg text-white ${toastType === "success" ? "bg-green-500" : "bg-red-500"}`}
                >
                    <div className="flex items-center justify-between">
                        <span>{toastMessage}</span>
                        <button onClick={() => setShowToast(false)}>&times;</button>
                    </div>
                    {toastType === "success" && (
                        <div className="mt-4 text-center">
                            <Button colorScheme="blue" onClick={handleOk}>
                                OK
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
