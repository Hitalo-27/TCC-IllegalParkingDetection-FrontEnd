"use client";

import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Mapa } from "@/src/components/ui/mapa";
import { useState } from "react";
import { API_BASE_URL } from "@/src/config/env";

export default function Search() {
  const [plate, setPlate] = useState("");
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedInfraction, setSelectedInfraction] = useState<any | null>(null);

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
              <Card className="p-6 space-y-6">
                {searchResult.infracoes.map((inf: any, index: number) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-[3fr_2fr] p-4 bg-gray-50 rounded-lg items-center"
                  >
                    <div className="flex flex-col justify-center">
                      <p>
                        <strong>Local:</strong>{" "}
                        {`Av. Paulista, ${inf.endereco.cidade}, SP - ${inf.endereco.pais}`}
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
            )}
          </div>
        )}

        <Mapa onMarkerClick={(data) => setSelectedInfraction(data)} />
      </div>

      {/* Modal */}
      {(selectedImage || selectedInfraction) && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 px-4"
          onClick={handleModalClick}
        >
          <div
            className="
        relative bg-white rounded-2xl shadow-2xl p-6 
        max-w-3xl w-full
        max-h-[90vh]
        flex flex-col
        border border-gray-200
      "
          >
            {selectedInfraction ? (
              <div className="flex flex-col items-center flex-grow">

                {/* IMAGEM COM TAMANHO CONTROLADO (SEM CRIAR SCROLL) */}
                <img
                  src={selectedInfraction.imagem}
                  className="
              rounded-xl 
              max-h-[45vh] 
              w-auto
              object-contain 
              border border-gray-200 shadow-sm mb-5
            "
                />

                {/* TÍTULO */}
                <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-1">
                  Detalhes da Infração
                </h2>
                <div className="h-[2px] w-24 bg-[hsl(var(--primary))]/30 rounded mb-4"></div>

                {/* DUAS COLUNAS SEM ESTOURAR A TELA */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full text-gray-800">

                  {/* COLUNA ESQUERDA */}
                  <div className="space-y-1">
                    <p>
                      <span className="font-semibold text-gray-700">Local:</span>{" "}
                      <span className="text-gray-900">{selectedInfraction.rua}</span>
                    </p>

                    <p>
                      <span className="font-semibold text-gray-700">Cidade:</span>{" "}
                      <span className="text-gray-900">{selectedInfraction.cidade}</span>
                    </p>

                    <p>
                      <span className="font-semibold text-gray-700">Estado:</span>{" "}
                      <span className="text-gray-900">{selectedInfraction.estado}</span>
                    </p>

                    <p>
                      <span className="font-semibold text-gray-700">Registrado por:</span>{" "}
                      <span className="text-gray-900">{selectedInfraction.user}</span>
                    </p>
                  </div>

                  {/* COLUNA DIREITA */}
                  <div className="space-y-1">
                    <p>
                      <span className="font-semibold text-gray-700">Data:</span>{" "}
                      <span className="text-gray-900">{selectedInfraction.data}</span>
                    </p>

                    <p>
                      <span className="font-semibold text-gray-700">Infração:</span>{" "}
                      <span className="text-gray-900">{selectedInfraction.infracao}</span>
                    </p>

                    <p>
                      <span className="font-semibold text-gray-700">Pontos:</span>{" "}
                      <span className="text-gray-900">{selectedInfraction.pontos}</span>
                    </p>
                  </div>

                </div>
              </div>
            ) : (
              <img
                src={selectedImage!}
                alt="Imagem Ampliada"
                className="rounded-lg max-h-[80vh] max-w-[85vw] object-contain"
              />
            )}

            {/* Botão de fechar */}
            <button
              onClick={closeModal}
              className="
          absolute -top-4 -right-4 bg-white shadow-lg 
          text-gray-700 font-bold rounded-full 
          w-10 h-10 flex items-center justify-center 
          hover:bg-gray-100 transition border
        "
            >
              ✕
            </button>
          </div>
        </div>
      )}{/* Modal */}
      {(selectedImage || selectedInfraction) && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 px-4"
          onClick={handleModalClick}
        >
          <div
            className="
        relative bg-white rounded-2xl shadow-2xl p-6 
        max-w-3xl w-full
        max-h-[90vh]
        flex flex-col
        border border-gray-200
      "
          >
            {selectedInfraction ? (
              <div className="flex flex-col items-center flex-grow">

                {/* IMAGEM COM TAMANHO CONTROLADO (SEM CRIAR SCROLL) */}
                <img
                  src={selectedInfraction.imagem}
                  className="
              rounded-xl 
              max-h-[45vh] 
              w-auto
              object-contain 
              border border-gray-200 shadow-sm mb-5
            "
                />

                {/* TÍTULO */}
                <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-1">
                  Detalhes da Infração
                </h2>
                <div className="h-[2px] w-24 bg-[hsl(var(--primary))]/30 rounded mb-4"></div>

                {/* DUAS COLUNAS SEM ESTOURAR A TELA */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full text-gray-800">

                  {/* COLUNA ESQUERDA */}
                  <div className="space-y-1">
                    <p>
                      <span className="font-semibold text-gray-700">Local:</span>{" "}
                      <span className="text-gray-900">{selectedInfraction.rua}</span>
                    </p>

                    <p>
                      <span className="font-semibold text-gray-700">Cidade:</span>{" "}
                      <span className="text-gray-900">{selectedInfraction.cidade}</span>
                    </p>

                    <p>
                      <span className="font-semibold text-gray-700">Estado:</span>{" "}
                      <span className="text-gray-900">{selectedInfraction.estado}</span>
                    </p>

                    <p>
                      <span className="font-semibold text-gray-700">Registrado por:</span>{" "}
                      <span className="text-gray-900">{selectedInfraction.user}</span>
                    </p>
                  </div>

                  {/* COLUNA DIREITA */}
                  <div className="space-y-1">
                    <p>
                      <span className="font-semibold text-gray-700">Data:</span>{" "}
                      <span className="text-gray-900">{selectedInfraction.data}</span>
                    </p>

                    <p>
                      <span className="font-semibold text-gray-700">Infração:</span>{" "}
                      <span className="text-gray-900">{selectedInfraction.infracao}</span>
                    </p>

                    <p>
                      <span className="font-semibold text-gray-700">Pontos:</span>{" "}
                      <span className="text-gray-900">{selectedInfraction.pontos}</span>
                    </p>
                  </div>

                </div>
              </div>
            ) : (
              <img
                src={selectedImage!}
                alt="Imagem Ampliada"
                className="rounded-lg max-h-[80vh] max-w-[85vw] object-contain"
              />
            )}

            {/* Botão de fechar */}
            <button
              onClick={closeModal}
              className="
          absolute -top-4 -right-4 bg-white shadow-lg 
          text-gray-700 font-bold rounded-full 
          w-10 h-10 flex items-center justify-center 
          hover:bg-gray-100 transition border
        "
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
