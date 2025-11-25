"use client";

import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { useState } from "react";
import { API_BASE_URL } from "@/src/config/env";
import { ReloadIcon, InfoCircledIcon } from "@radix-ui/react-icons";

// Dados simulados de resultado da validação

type mockValidationResult = {
  hasInfraction: boolean;
  plate: string;
  location: string;
  datetime: string;
  infraction: string;
  type: string;
};

export default function Validate() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationResult, setValidationResult] =
    useState<mockValidationResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Criar preview da imagem
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) return;

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Token não encontrado. Faça login novamente.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_BASE_URL}/plate/identification`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`
        },
      });

      const data = await response.json();

      //Exibir resposta correta caso não tenha nenhuma infração

      if (!response.ok) {
        throw new Error("Credenciais inválidas");
      }

      setValidationResult(data);
      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Validação de Infrações
        </h1>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="file">Enviar Imagem</Label>
              <Input
                id="file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 cursor-pointer"
              />
              <p className="text-sm text-gray-500 mt-1">
                Formatos aceitos: JPG, PNG
              </p>
            </div>

            {preview && (
              <div className="mt-4">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-64 rounded-lg mx-auto"
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={!file || loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <ReloadIcon className="h-4 w-4 animate-spin" />
                  Enviando...
                </div>
              ) : (
                "Validar"
              )}
            </Button>
          </form>
        </Card>

        {validationResult && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Resultado da Análise</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    validationResult.hasInfraction
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                />
                <p className="font-medium">
                  {validationResult.hasInfraction
                    ? "Infração Detectada"
                    : "Nenhuma Infração Detectada"}
                </p>
              </div>
              {validationResult.hasInfraction && (
                <>
                  <p>
                    <span className="font-medium">Placa:</span>{" "}
                    {validationResult.plate}
                  </p>
                  <p>
                    <span className="font-medium">Local:</span>{" "}
                    {validationResult.location}
                  </p>
                  <p>
                    <span className="font-medium">Data/Hora:</span>{" "}
                    {validationResult.datetime}
                  </p>
                  <p>
                    <span className="font-medium">Infração:</span>{" "}
                    {validationResult.infraction}
                  </p>
                  <p>
                    <span className="font-medium">Tipo de Infração:</span>{" "}
                    {validationResult.type}
                  </p>
                </>
              )}
            </div>
          </Card>
        )}
        <div className="pt-4 border-t border-gray-200 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center justify-center gap-2">
            <InfoCircledIcon className="w-6 h-6" />
            Como funciona
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <Card className="p-4 overflow-hidden flex flex-col items-center text-center h-full hover:scale-105 transition-transform duration-300">
              <div className="w-full relative mb-4 bg-gray-100 rounded-md overflow-hidden">
                <img 
                  src="/foto1.png" 
                  alt="Enquadramento do carro na calçada" 
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="font-bold text-lg mb-2">1. Localize a Infração</h3>
              <p className="text-gray-600 text-sm">
                Identifique o veículo estacionado irregularmente (ex: rodas sobre a calçada) e posicione-se para capturar o contexto.
              </p>
            </Card>

            <Card className="p-4 overflow-hidden flex flex-col items-center text-center h-full hover:scale-105 transition-transform duration-300">
              <div className="w-full relative mb-4 bg-gray-100 rounded-md overflow-hidden">
                <img 
                  src="/foto2.png" 
                  alt="Foco na placa do veículo" 
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="font-bold text-lg mb-2">2. Foque na Placa</h3>
              <p className="text-gray-600 text-sm">
                Aproxime a câmera garantindo que a placa esteja nítida e iluminada na foto para uma melhor leitura.
              </p>
            </Card>

            <Card className="p-4 overflow-hidden flex flex-col items-center text-center h-full hover:scale-105 transition-transform duration-300">
              <div className="w-full relative mb-4 bg-gray-100 rounded-md overflow-hidden">
                <img 
                  src="/foto3.png" 
                  alt="Envio da imagem no sistema" 
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="font-bold text-lg mb-2">3. Envie para Validar</h3>
              <p className="text-gray-600 text-sm">
                Faça o upload da imagem neste painel. O sistema analisará automaticamente se há infração e identificará a placa, se possível.
              </p>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
