"use client";

import { Card } from "@/src/components/ui/card";
import { API_BASE_URL } from "@/src/config/env";
import { useEffect, useState } from "react";
import { useUser } from "@/src/contexts/UserContext";
import { Mapa } from "@/src/components/ui/mapa";
import ModalInfraction from "@/src/components/ui/modalinfractions";

export default function Vehicles() {
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
          setError("Token não encontrado. Faça login novamente.");
          setLoading(false);
          return;
        }

        if (!id) {
          setError("Usuário não identificado.");
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
  }, [id]);

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

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Carregando...</p>;

  if (error)
    return (
      <p className="text-center mt-10 text-red-600 font-medium">{error}</p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Infrações Enviadas</h1>

        {/* Exibir resultado */}
        {infractions && (
          <div className="space-y-6">
            {infractions?.length > 0 && (
              <>
                <Card className="p-6 space-y-6">
                  {infractions.map((inf: any, index: number) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 md:grid-cols-[3fr_2fr] p-4 bg-gray-50 rounded-lg items-center"
                    >
                      <div className="flex flex-col justify-center">
                        <p>
                          <strong>Placa:</strong> {inf.veiculo.placa_numero}
                        </p>
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
                  locations={infractions.map((inf: any) => ({
                    id: inf.id || Math.random(),
                    placa: inf.veiculo.placa_numero,
                    latitude: Number(inf.endereco.latitude),
                    longitude: Number(inf.endereco.longitude),
                    rua: inf.endereco.rua,
                    cidade: inf.endereco.cidade,
                    estado: inf.endereco.estado,
                    data: new Date(inf.data).toLocaleString("pt-BR"),
                    imagem: `${API_BASE_URL}${inf.imagem}`,
                    user: null,
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
