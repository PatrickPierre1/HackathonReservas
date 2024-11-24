"use client";

import { Stack, Table } from "@chakra-ui/react"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Historico {
  id: number,
  reserva_id: number,
  alteracoes: string,
  reserva: {
    id: number,
    usuario_id: number,
    ambiente_id: number,
    data_hora_inicio: string,
    data_hora_fim: string,
    status: string,
  }
}

export default function Historicos() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('unialfa.token');
    const permissoes = localStorage.getItem('unialfa.permissoes');

    if (!token || permissoes === "Professor") {
      router.replace('/');
    }
  }, [router]);

  const [historico, setHistorico] = useState<Historico[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchHistorico() {
      try {
        const token = localStorage.getItem('unialfa.token');
        const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + "/historico-reservas", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          setHistorico(Array.isArray(response.data) ? response.data : []);
        } else {
          throw new Error('Erro ao buscar ambientes');
        }
      } catch (error) {
        console.error('Erro:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHistorico();
  }, []);

  return (
    <>
      <Stack width="full" gap="5">
        <Table.ScrollArea borderWidth="1px" maxW="screen">
          <Table.Root size="md" variant="line" striped interactive>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader fontWeight={"bold"}>Reserva ID</Table.ColumnHeader>
                <Table.ColumnHeader fontWeight={"bold"}>Usuario ID</Table.ColumnHeader>
                <Table.ColumnHeader fontWeight={"bold"}>Ambiente ID</Table.ColumnHeader>
                <Table.ColumnHeader fontWeight={"bold"}>Alterações</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {historico.map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell>{item.reserva_id}</Table.Cell>
                  <Table.Cell>{item.reserva.usuario_id}</Table.Cell>
                  <Table.Cell>{item.reserva.ambiente_id}</Table.Cell>
                  <Table.Cell>{item.alteracoes}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      </Stack>
      <ToastContainer position="bottom-right" autoClose={5000} />
    </>
  )
}