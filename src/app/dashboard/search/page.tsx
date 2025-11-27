"use client";

import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Mapa } from "@/src/components/ui/mapa";
import { useState } from "react";
import { API_BASE_URL } from "@/src/config/env";
import ModalInfraction from "@/src/components/ui/modalinfractions";
import { ImageModal } from "@/src/components/ui/modalvehicles";
import { useRouter } from "next/navigation";

export default function Search() {
  const router = useRouter()
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
      setError("Informe a placa do veículo.");
      return;
    }

    setError(null);
    setLoading(true);
    setSearchResult(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Token não encontrado. Faça login novamente.");
        router.push('/login?error=unauthorized')
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
        router.push('/login?error=unauthorized')
        return;
      }

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Erro ao consultar infrações.");
      }

      const data = await response.json();
      console.log("AAAAA --> ", data)
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Consulta de Infrações
        </h1>

        <Card className="p-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="plate">Placa do Veículo</Label>
              <Input
                id="plate"
                value={plate}
                onChange={(e) => setPlate(e.target.value.toUpperCase())}
                placeholder="COM6864"
                className="mt-1"
                maxLength={7}
              />
            </div>
            <Button type="submit" className="self-end" disabled={loading}>
              {loading ? "Buscando..." : "Buscar"}
            </Button>
          </form>

          {error && <p className="text-red-600 mt-3">{error}</p>}
        </Card>

        {/* Exibir resultado */}
        {searchResult && (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                Resultado para a placa:{" "}
                <span className="text-blue-600">{searchResult.placa}</span>
              </h2>
              <p className="text-gray-700">
                {searchResult.infracoes?.length > 0
                  ? `${searchResult.infracoes.length} infração(ões) encontrada(s).`
                  : "Nenhuma infração encontrada."}
              </p>
            </Card>

            {searchResult.infracoes?.length > 0 && (
              <>
                <Card className="p-6 space-y-6">
                  {searchResult.infracoes.map((inf: any, index: number) => (
                    <div
                      key={index}
                      // 1. ALTERADO: Removido 'items-center' para permitir stretch
                      className="grid grid-cols-1 md:grid-cols-[3fr_2fr] p-4 bg-gray-50 rounded-lg gap-4"
                    >
                      {/* 2. ALTERADO: Adicionado flex-col e justify-center para centralizar texto */}
                      <div className="flex flex-col justify-center space-y-1">
                        <p>
                          <strong>Local:</strong>{" "}
                          {`${inf.endereco.rua}, ${inf.endereco.cidade}, ${inf.endereco.estado} - ${inf.endereco.pais}`}
                        </p>
                        <p className="font-medium">
                          <strong>Data/Hora:</strong>{" "}
                          {new Date(inf.data).toLocaleString("pt-BR")}
                        </p>
                        <p>
                          <strong>Motivo:</strong> {inf.tipo_infracao.descricao}
                        </p>
                        <p>
                          <strong>Tipo de Infração:</strong>{" "}
                          {inf.tipo_infracao.gravidade}
                        </p>
                        <p>
                          <strong>Pontos:</strong> {inf.tipo_infracao.pontos}
                        </p>
                        <p>
                          <strong>Enviado por:</strong> {inf.user.username}
                        </p>
                      </div>

                      {inf.imagem && (
                        // 3. ALTERADO: Div relativa com altura mínima, e imagem absoluta dentro
                        <div className="relative h-full min-h-[140px] w-full">
                          <div
                            className="absolute inset-0 group cursor-zoom-in w-full h-full"
                            onClick={() =>
                              handleImageClick(`${API_BASE_URL}${inf.imagem}`)
                            }
                          >
                            <img
                              src={`${API_BASE_URL}${inf.imagem}`}
                              alt={`Infração ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg transition-opacity hover:opacity-90"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-lg">
                              <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded whitespace-nowrap">
                                Clique para ampliar
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </Card>

                {/* Mapa */}
                <Mapa
                  locations={searchResult.infracoes.map((inf: any) => ({
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
                  }))}
                  onMarkerClick={(data) => setSelectedInfraction(data)}
                />
              </>
            )}
          </div>
        )}
      </div>

      {/* 3. Modal exclusivo para Zoom da Imagem */}
      <ImageModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage}
      />

      {/* 4. Modal exclusivo para Detalhes do Mapa */}
      <ModalInfraction
        selectedImage={null}
        selectedInfraction={selectedInfraction}
        closeModal={closeModal}
        handleModalClick={handleModalClick}
      />
    </div>
  );
}