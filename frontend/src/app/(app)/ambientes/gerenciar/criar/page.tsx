"use client";
import { Button, Fieldset, Input, Stack, Textarea } from "@chakra-ui/react"
import { Field } from "@/components/ui/field"
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Criar() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('unialfa.token');
        const permissoes = localStorage.getItem('unialfa.permissoes');


        if (!token || permissoes === "Professor") {
            router.replace('/ambientes');
        }
    }, [router]);
    return (
        <>
            <div className="flex justify-center items-center mt-32">
                <Fieldset.Root style={{ boxShadow: "0px 0px 40px 8px rgba(0,0,0,0.1)" }} size="md" maxW="2xl" bg={"#fff"} padding={8} borderRadius={8}>
                    <Stack>
                        <Fieldset.Legend fontWeight={"bold"} fontSize={"xl"}>Criando Ambientes</Fieldset.Legend>
                        <Fieldset.HelperText>
                            Por favor preencha corretamente
                        </Fieldset.HelperText>
                    </Stack>

                    <Fieldset.Content>
                        <Field label="Nome">
                            <Input padding={2} border={"2px"} borderStyle={"solid"} borderColor={"gray.200"} name="name" />
                        </Field>

                        <Field label="Tipo">
                            <Input padding={2} border={"2px"} borderStyle={"solid"} borderColor={"gray.200"} />
                        </Field>

                        <Field label="Descrição">
                            <Textarea height={"100px"} border={"2px"} borderStyle={"solid"} borderColor={"gray.200"} />
                        </Field>

                    </Fieldset.Content>

                    <Button marginTop={10} backgroundColor={"#3c89f5"} padding={5} color={"white"} type="submit" alignSelf="flex-end">
                        Enviar
                    </Button>
                </Fieldset.Root>
            </div>
        </>
    )
}