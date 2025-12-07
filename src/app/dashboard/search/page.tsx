"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search as SearchIcon,
  MapPin,
  Calendar,
  User,
  Car,
  Maximize2,
  AlertCircle,
  Loader2,
} from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Mapa } from "@/src/components/ui/mapa";
import { API_BASE_URL } from "@/src/config/env";
import ModalInfraction from "@/src/components/ui/modalinfractions";
import { ImageModal } from "@/src/components/ui/modalvehicles";

// Função auxiliar para cores de gravidade
const getSeverityColor = (severity: string) => {
  const s = severity?.toLowerCase() || "";
  if (s.includes("gravíssima") || s.includes("grave"))
    return "bg-red-100 text-red-700 border-red-200";
  if (s.includes("média"))
    return "bg-orange-100 text-orange-700 border-orange-200";
  return "bg-green-100 text-green-700 border-green-200";
};

export default function Search() {
  const router = useRouter();
  const [plate, setPlate] = useState("");
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedInfraction, setSelectedInfraction] = useState<any | null>(
    null
  );

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!plate.trim()) {
      setError("Por favor, informe a placa do veículo.");
      return;
    }

    setError(null);
    setLoading(true);
    setSearchResult(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Sessão expirada. Faça login novamente.");
        router.push("/login?error=unauthorized");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/infracoes/consultar?placa=${encodeURIComponent(
          plate
        )}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 401) {
        setLoading(false);
        router.push("/login?error=unauthorized");
        return;
      }

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Erro ao consultar infrações.");
      }

      const data = await response.json();
      setSearchResult(data);
    } catch (err: any) {
      setError(err.message || "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

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
    searchResult?.infracoes?.filter((inf: any) => {
      const lat = inf.endereco?.latitude;
      const lng = inf.endereco?.longitude;
      return lat && lng && String(lat) !== "0" && String(lng) !== "0";
    }) || [];

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-6">
      {/* 1. Mudei max-w-5xl para max-w-7xl para usar mais a tela */}
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Cabeçalho e Busca - Mantive centralizado em max-w-3xl para não esticar demais o input */}
        <div className="flex flex-col items-center justify-center space-y-6 pt-4 md:pt-8 w-full">
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Consulta de Infrações
            </h1>
            <p className="text-gray-500">
              Pesquise o histórico de infrações pela placa do carro.
            </p>
          </div>

          <div className="w-full max-w-3xl">
            <Card className="shadow-lg border-0 ring-1 ring-gray-200">
              <CardContent className="p-2">
                <form onSubmit={handleSearch} className="flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <Car className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="plate"
                      value={plate}
                      onChange={(e) => setPlate(e.target.value.toUpperCase())}
                      placeholder="ABC1234"
                      className="pl-10 h-12 text-lg uppercase placeholder:normal-case border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                      maxLength={7}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-12 px-6 bg-primary hover:bg-primary/90 text-white font-medium transition-colors rounded-md"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <SearchIcon className="w-5 h-5" />
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {error && (
              <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg text-sm font-medium animate-in fade-in slide-in-from-top-2 justify-center">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Resultados - Aqui usamos a largura total do container (max-w-7xl) */}
        {searchResult && (
          <div className="space-y-8 animate-in fade-in duration-500 slide-in-from-bottom-4">
            {/* Visual da Placa Encontrada */}
            <div className="flex flex-col items-center justify-center space-y-4 border-b pb-8">
              <div className="bg-white border-2 border-gray-800 rounded-lg w-48 overflow-hidden shadow-sm transform hover:scale-105 transition-transform">
                <div className="bg-primary h-8 flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold tracking-widest">
                    BRASIL
                  </span>
                </div>
                <div className="py-2 text-center">
                  <span className="text-3xl font-mono font-bold text-gray-900 tracking-wider">
                    {searchResult.placa}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 font-medium">
                {searchResult.infracoes?.length > 0
                  ? `${searchResult.infracoes.length} infração(ões) encontrada(s)`
                  : "Nenhuma infração registrada para este veículo"}
              </p>
            </div>

            {searchResult.infracoes?.length > 0 && (
              <>
                {/* Grid de Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResult.infracoes.map((inf: any, index: number) => (
                    <Card
                      key={index}
                      className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 group bg-white flex flex-col"
                    >
                      <div className="relative h-56 w-full bg-gray-100 overflow-hidden">
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
                            <Car className="w-12 h-12" />
                          </div>
                        )}
                      </div>

                      <CardContent className="p-5 flex-1 flex flex-col gap-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 line-clamp-1 text-lg">
                            {inf.tipo_infracao.descricao}
                          </h3>
                          <div className="flex items-center gap-2 mt-2 text-xs">
                            <span
                              className={`px-2.5 py-0.5 rounded-full border ${getSeverityColor(
                                inf.tipo_infracao.gravidade
                              )} font-medium`}
                            >
                              {inf.tipo_infracao.gravidade}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200 font-medium">
                              {inf.tipo_infracao.pontos} pts
                            </span>
                          </div>
                        </div>

                        <hr className="border-gray-100" />

                        <div className="space-y-3 text-sm text-gray-600">
                          <div className="flex items-center gap-3">
                            <Calendar className="w-4 h-4 text-primary shrink-0" />
                            <span>
                              {new Date(inf.data).toLocaleString("pt-BR")}
                            </span>
                          </div>

                          <div className="flex items-start gap-3">
                            <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                            <span className="line-clamp-2">
                              {inf.endereco
                                ? `${inf.endereco.rua}, ${inf.endereco.cidade}`
                                : "Local não identificado"}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 pt-1">
                            <User className="w-4 h-4 text-primary shrink-0" />
                            <span className="text-gray-500 text-xs">
                              Por:{" "}
                              <span className="font-medium text-gray-700">
                                {inf.user.username}
                              </span>
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* 2. MAPA CONDICIONAL - Só aparece se validLocations > 0 */}
                {validLocations.length > 0 && (
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-gray-700" />
                      <h2 className="text-xl font-bold text-gray-800">
                        Geolocalização das Infrações
                      </h2>
                    </div>
                    {/* Card expandido para largura total do container pai (max-w-7xl) */}
                    <Card className="overflow-hidden border shadow-md rounded-xl w-full">
                      <div className="h-[500px] w-full relative">
                        <Mapa
                          locations={validLocations.map((inf: any) => ({
                            id: inf.id || Math.random(),
                            latitude: Number(inf.endereco?.latitude),
                            longitude: Number(inf.endereco?.longitude),
                            rua: inf.endereco?.rua,
                            cidade: inf.endereco?.cidade,
                            estado: inf.endereco?.estado,
                            data: new Date(inf.data).toLocaleString("pt-BR"),
                            imagem: `${API_BASE_URL}${inf.imagem}`,
                            user: inf.user?.username || "Desconhecido",
                            pontos: inf.tipo_infracao.pontos,
                            infracao: inf.tipo_infracao.descricao,
                            placa: searchResult.placa,
                          }))}
                          onMarkerClick={(data) => setSelectedInfraction(data)}
                        />
                      </div>
                    </Card>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

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
