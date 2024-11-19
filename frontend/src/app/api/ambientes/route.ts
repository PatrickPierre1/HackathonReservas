import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const ambientes = [
        {
            id: 1,
            nome: "Biblioteca",
            tipo: "Espaço de Estudo",
            status: "disponível",
            descricao: "Espaço para leitura e estudo.",
        },
        {
            id: 2,
            nome: "Salas",
            tipo: "Sala de Reunião",
            status: "reservado",
            descricao: "Salas para reuniões e aulas.",
        },
        {
            id: 3,
            nome: "AlphaLAB",
            tipo: "Laboratório",
            status: "manutenção",
            descricao: "Laboratório de tecnologia e inovação.",
        },
        {
            id: 4,
            nome: "Auditório",
            tipo: "Espaço para Eventos",
            status: "disponível",
            descricao: "Espaço para eventos e apresentações.",
        },
    ];

    return NextResponse.json(ambientes);
}
