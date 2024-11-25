"use client";

import React, { useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export default function ToastProvider({
  children,
}: {
  permissions: string[];
  children: React.ReactNode;
}) {
  const hasShownToast = useRef(false);

  const fetchReservas = async () => {
    try {
      const token = localStorage.getItem("unialfa.token");
      const usuarioId = localStorage.getItem("unialfa.usuario_id");

      if (!usuarioId) {
        throw new Error("Usuário não encontrado. Faça login novamente.");
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/reservas?usuario_id=${usuarioId}&proximos7Dias=true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data != 0 && !hasShownToast.current) {

        response.data == 1 ? toast.error(
            `Atenção! Você tem ${response.data} reserva para os próximos 7 dias`,
            { progress: 0.99 }
        ) : toast.error(
            `Atenção! Você tem ${response.data} reservas para os próximos 7 dias`,
            { progress: 0.99 }
        )

        hasShownToast.current = true;
      }
    } catch (error) {
      console.error("Erro ao buscar reservas para os próximos 7 dias:", error);
    }
  };

  useEffect(() => {
    fetchReservas();

    return () => {
      hasShownToast.current = false;
    };
  }, []);

  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
}
