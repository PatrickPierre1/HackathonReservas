"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { FaFilter } from "react-icons/fa";

interface Ambiente {
  id: number;
  nome: string;
  tipo: string;
  status: string;
  capacidade: number;
  maquinas_disponiveis: number;
  hora_inicio: string;
  hora_fim: string;
  descricao: string;
}
export default function Home() {
  const router = useRouter();
  const [ambientes, setAmbientes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reservasFiltradas, setReservasFiltradas] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [nome, setNome] = useState<string | null>(null);
  const [permissoes, setPermissoes] = useState<string | null>(null);
  const [selectedAmbiente, setSelectedAmbiente] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState(0);

  // Validando Token 
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

  // Adicionando Imagens de carroussel
  const images = [
    "https://www.alfaumuarama.edu.br/downloads/banner/1726576606_1.jpg",
    "https://www.alfaumuarama.edu.br/downloads/banner/1728647348_1.jpg",
    "https://www.alfaumuarama.edu.br/downloads/banner/1713567262_1.jpg",
  ];

  useEffect(() => {
    // Configura o intervalo para trocar de imagem automaticamente
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };


  // Fazendo a conexão com o back
  useEffect(() => {
    async function fetchAmbientes() {
        try {
            const token = localStorage.getItem('unialfa.token');
            const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + "/ambientes", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                setAmbientes(Array.isArray(response.data.data) ? response.data.data : []);
            } else {
                throw new Error('Erro ao buscar ambientes');
            }
        } catch (error) {
            console.error('Erro:', error);
        } finally {
            setIsLoading(false);
        }
    }

    fetchAmbientes();
}, []);

const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  const selectedValue = event.target.value;
  setSelectedAmbiente(selectedValue);

  // Filtra os ambientes com base na seleção do usuário
  if (selectedValue === "") {
    setReservasFiltradas(ambientes); // Se o filtro for vazio, mostra todos
  } else {
    setReservasFiltradas(
      ambientes.filter((ambiente) => ambiente.nome === selectedValue)
    );
  }
};

  if (!isClient) {
    return null;
  }

  return (
    <>
     
     <div className="min-h-screen bg-gray-100 flex flex-col items-center">

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

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {images.map((_, index) => (
            <div
              key={index}
              onClick={() => goToImage(index)}
              className={`w-8 h-0.5 bg-gray-800 ${currentIndex === index ? "opacity-80" : "opacity-40"} cursor-pointer transition-all duration-300`}
            />
          ))}
        </div>
      </div>

        {/* Filtro de ambientes */}
        <div className="mb-6 w-full max-w-sm">
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <FaFilter />
          </span>
          <select
            value={selectedAmbiente}
            onChange={handleFilterChange}
            className="w-full px-10 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="">Selecione um ambiente</option>
            {ambientes.map((ambiente) => (
              <option key={ambiente.id} value={ambiente.nome}>
                {ambiente.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

        {/* Exibição dos ambientes filtrados ou todos os ambientes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {isLoading ? (
            <p>Carregando...</p>
          ) : (
            (selectedAmbiente ? reservasFiltradas : ambientes).map((ambiente) => (
              <div
                key={ambiente.id}
                className="bg-white shadow-md rounded-lg p-6 text-center"
              >
                <h2 className="text-xl font-semibold">{ambiente.nome}</h2>
                <p>{ambiente.descricao}</p>
                {Number(ambiente.status) === 1 && (
                  <button
                    onClick={() =>
                      router.push(`/reservas/gerenciar/agendar/${ambiente.id}`)
                    }
                    className="mt-4 px-6 py-3 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition"
                  >
                    Agendar
                  </button>
                )}
              </div>
            ))
          )}
        </div>
       
      </div>
    </>
  );
}
