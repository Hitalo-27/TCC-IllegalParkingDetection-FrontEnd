"use client";

import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Mapa } from "@/src/components/ui/mapa";
import { useState } from "react";
import { API_BASE_URL } from "@/src/config/env";
import ModalInfraction from "@/src/components/ui/modalinfractions";

export default function Search() {
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
                      className="grid grid-cols-1 md:grid-cols-[3fr_2fr] p-4 bg-gray-50 rounded-lg items-center"
                    >
                      <div className="flex flex-col justify-center">
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
                        <div className="flex justify-end">
                          <img
                            src={`${API_BASE_URL}${inf.imagem}`}
                            alt={`Infração ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg cursor-pointer max-w-xs"
                            onClick={() =>
                              handleImageClick(`${API_BASE_URL}${inf.imagem}`)
                            }
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </Card>
                {/* 👇 Passando os dados reais para o mapa */}
                <Mapa
                  locations={searchResult.infracoes.map((inf: any) => ({
                    id: inf.id || Math.random(),
                    latitude: Number(inf.endereco.latitude),
                    longitude: Number(inf.endereco.longitude),
                    rua: inf.endereco.rua,
                    cidade: inf.endereco.cidade,
                    estado: inf.endereco.estado,
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

      <ModalInfraction
        selectedImage={selectedImage}
        selectedInfraction={selectedInfraction}
        closeModal={closeModal}
        handleModalClick={handleModalClick}
      />
    </div>
  );
}
