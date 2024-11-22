"use client";
import { Button, Fieldset, Input, Stack, Menu, MenuItem } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Criar() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("unialfa.token");
        const permissoes = localStorage.getItem("unialfa.permissoes");

        if (!token || permissoes === "Professor") {
            router.replace("/configuracoes");
        }
    }, [router]);

    const handlePermissionSelect = (permission: string) => {
        console.log("Permissão selecionada:", permission);
    };

    return (
        <>
            <div className="flex justify-center items-center mt-32">
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
                                borderColor={"gray.200"}
                                name="name"
                            />
                        </Field>

                        <Field label="E-mail">
                            <Input
                                padding={2}
                                border={"2px"}
                                borderStyle={"solid"}
                                borderColor={"gray.200"}
                            />
                        </Field>

                        <Field label="Senha">
                            <Input
                                type="password"
                                padding={2}
                                border={"2px"}
                                borderStyle={"solid"}
                                borderColor={"gray.200"}
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
                        Criar
                    </Button>
                </Fieldset.Root>
            </div>
        </>
    );
}
