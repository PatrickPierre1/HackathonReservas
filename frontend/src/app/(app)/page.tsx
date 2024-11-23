"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const images = [
    "https://www.alfaumuarama.edu.br/downloads/banner/1726576606_1.jpg",
    "https://www.alfaumuarama.edu.br/downloads/banner/1728647348_1.jpg",
    "https://www.alfaumuarama.edu.br/downloads/banner/1713567262_1.jpg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Configura o intervalo para trocar de imagem automaticamente
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // 3000ms = 3 segundos

    return () => clearInterval(interval);
  }, []);

  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  const [nome, setNome] = useState<string | null>(null);
  const [permissoes, setPermissoes] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem("unialfa.token");
    if (!token) {
      router.replace("/login");
    } else {
      setNome(localStorage.getItem("unialfa.nome"));
      setPermissoes(localStorage.getItem("unialfa.permissoes"));
    }
  }, [router]);

  if (!isClient) {
    return null;
  }

  return (
    <>
     
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      {/* Título centralizado no topo */}
      <h1 className="text-5xl font-bold text-gray-800 mt-8 mb-6">
        Bem-vindo ao <span className="text-blue-600">Sistema Unialfa</span>
      </h1>

      {/* Carrossel de imagens */}
      <div className="relative w-full max-w-5xl overflow-hidden rounded-lg shadow-lg mb-12">
        <div
          className="flex transition-transform duration-700"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {images.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Imagem ${index + 1}`}
              className="w-full h-[400px] object-cover flex-shrink-0"
            />
          ))}
        </div>
      </div>
        <div className="flex space-x-4">
          <button
            onClick={() => router.push("/ambientes/gerenciar")}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Gerenciar Ambientes
          </button>
          <button
            onClick={() => router.push("/reservas")}
            className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition"
          >
            Reservas
          </button>
        </div>
      </div>
    </>
  );
}
