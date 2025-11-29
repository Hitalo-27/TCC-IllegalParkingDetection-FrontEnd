"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Calendar,
  AlertTriangle,
  Car,
  AlertCircle,
  Maximize2,
} from "lucide-react"; // Certifique-se de ter lucide-react instalado

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { API_BASE_URL } from "@/src/config/env";
import { useUser } from "@/src/contexts/UserContext";
import { Mapa } from "@/src/components/ui/mapa";
import ModalInfraction from "@/src/components/ui/modalinfractions";
import { ImageModal } from "@/src/components/ui/modalvehicles";

// Função auxiliar para cor da gravidade
const getSeverityColor = (severity: string) => {
  const s = severity?.toLowerCase() || "";
  if (s.includes("gravíssima") || s.includes("grave"))
    return "bg-red-100 text-red-700 border-red-200";
  if (s.includes("média"))
    return "bg-orange-100 text-orange-700 border-orange-200";
  return "bg-green-100 text-green-700 border-green-200";
};

export default function Vehicles() {
  const router = useRouter();
  const { id } = useUser();

  const [infractions, setInfractions] = useState([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInfraction, setSelectedInfraction] = useState<any | null>(
    null
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Sessão expirada.");
          router.push("/login?error=unauthorized");
          setLoading(false);
          return;
        }

        if (!id) {
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${API_BASE_URL}/infracoes/consultar?user=${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.detail || "Erro ao consultar infrações.");
        }

        const data = await response.json();
        setInfractions(data.infracoes || []);
      } catch (err: any) {
        setError(err.message || "Erro inesperado.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, router]); // Adicionado router e id nas dependências

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setSelectedInfraction(null);
  };

  const handleModalClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const validLocations =
    infractions?.filter((inf: any) => {
      const lat = inf.endereco?.latitude;
      const lng = inf.endereco?.longitude;
      return lat && lng && String(lat) !== "0" && String(lng) !== "0";
    }) || [];

  // Renderização do Esqueleto de Carregamento (Loading State)
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 bg-gray-200 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-red-100 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">
            Ocorreu um erro
          </h3>
          <p className="text-gray-600 mt-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header da Página */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Monitoramento
            </h1>
            <p className="text-gray-500 mt-1">
              Gerencie as infrações detectadas e analise o mapa.
            </p>
          </div>
          <div className="bg-white px-4 py-2 rounded-full border shadow-sm text-sm font-medium text-gray-600">
            Total de registros:{" "}
            <span className="text-gray-900">{infractions.length}</span>
          </div>
        </div>

        {/* Grid de Infrações */}
        {infractions && infractions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {infractions.map((inf: any, index: number) => (
              <Card
                key={index}
                className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 group bg-white flex flex-col"
              >
                {/* Imagem (Topo do Card) */}
                <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                  {inf.imagem ? (
                    <>
                      <img
                        src={`${API_BASE_URL}${inf.imagem}`}
                        alt={`Infração ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div
                        onClick={() =>
                          handleImageClick(`${API_BASE_URL}${inf.imagem}`)
                        }
                        className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all cursor-zoom-in flex items-center justify-center"
                      >
                        <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 drop-shadow-lg" />
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <Car className="w-10 h-10" />
                    </div>
                  )}

                  {/* Badge de Placa Flutuante */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md shadow-sm border border-gray-100">
                    <span className="font-mono font-bold text-gray-800">
                      {inf.veiculo.placa_numero}
                    </span>
                  </div>
                </div>

                <CardContent className="p-5 flex-1 flex flex-col gap-4">
                  {/* Cabeçalho do Card */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900 line-clamp-1">
                        {inf.tipo_infracao.descricao}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500 font-medium">
                        <span
                          className={`px-2 py-0.5 rounded-full border ${getSeverityColor(
                            inf.tipo_infracao.gravidade
                          )}`}
                        >
                          {inf.tipo_infracao.gravidade}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                          {inf.tipo_infracao.pontos} pts
                        </span>
                      </div>
                    </div>
                  </div>

                  <hr className="border-gray-100" />

                  {/* Detalhes */}
                  <div className="space-y-2.5 text-sm text-gray-600">
                    <div className="flex items-start gap-2.5">
                      <Calendar className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span>
                        {inf.data
                          ? new Date(inf.data).toLocaleString("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "--/--/----"}
                      </span>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span className="line-clamp-2 leading-relaxed">
                        {inf.endereco
                          ? `${inf.endereco.rua}, ${inf.endereco.cidade} - ${inf.endereco.estado}`
                          : "Endereço não identificado"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <Car className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">
              Nenhuma infração registrada.
            </p>
          </div>
        )}

        {/* Mapa Section */}
        {validLocations.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-gray-700" />
              <h2 className="text-xl font-bold text-gray-800">
                Geolocalização das Infrações
              </h2>
            </div>

            <Card className="overflow-hidden border shadow-md rounded-xl">
              <div className="h-[500px] w-full relative">
                <Mapa
                  locations={infractions.map((inf: any) => ({
                    id: inf.id || Math.random(),
                    placa: inf.veiculo.placa_numero,
                    latitude: Number(inf.endereco?.latitude),
                    longitude: Number(inf.endereco?.longitude),
                    rua: inf.endereco?.rua,
                    cidade: inf.endereco?.cidade,
                    estado: inf.endereco?.estado,
                    data: new Date(inf.data).toLocaleString("pt-BR"),
                    imagem: `${API_BASE_URL}${inf.imagem}`,
                    user: null,
                    pontos: inf.tipo_infracao.pontos,
                    infracao: inf.tipo_infracao.descricao,
                  }))}
                  onMarkerClick={(data) => setSelectedInfraction(data)}
                />
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Modais */}
      <ImageModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage}
      />

      <ModalInfraction
        selectedImage={null}
        selectedInfraction={selectedInfraction}
        closeModal={closeModal}
        handleModalClick={handleModalClick}
      />
    </div>
  );
}
