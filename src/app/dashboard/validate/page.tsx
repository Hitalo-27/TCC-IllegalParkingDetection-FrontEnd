"use client";

import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { useState } from "react";
import { API_BASE_URL } from "@/src/config/env";
import { ReloadIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { X } from "lucide-react";

type validationResult = {
  success: boolean;
  message: string;
  hasInfraction: boolean;
  data: {
    plate: string;
    location: string;
    datetime: string;
    infraction: string;
    gravity: string;
    infraction_id: number;
    imagem: string;
  };
};

export default function Validate() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"success" | "error">(
    "error"
  );
  const [validationResult, setValidationResult] =
    useState<validationResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null); // Limpa erro ao selecionar novo arquivo
      setValidationResult(null); // Limpa resultado anterior

      // Criar preview da imagem local
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
    setError(null);

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
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      // 2. Lógica solicitada: Verificar success e atualizar imagem ou mostrar erro
      if (data.success === true) {
        setValidationResult(data);
        setToastVariant("success");
        setToastMessage("Imagem processada com sucesso!");
        setToastOpen(true);

        // Atualiza o preview para a imagem validada retornada pelo backend
        // Obs: Como o JSON retorna "/detect/..." assumi que é relativo à URL base.
        if (data.data && data.data.imagem) {
          // Remove a barra final do API_BASE_URL se existir para evitar duplicidade com a barra inicial da imagem
          const baseUrl = API_BASE_URL.replace(/\/$/, "");
          setPreview(`${baseUrl}${data.data.imagem}`);
        }
      } else {
        // Se success for false
        const msg = data.message || "Erro ao processar a imagem.";
        setToastVariant("error");
        setToastMessage(msg);
        setToastOpen(true);
        setValidationResult(null);
      }
    } catch (error) {
      console.error(error);
      setToastVariant("error");
      setToastMessage("Erro de conexão com o servidor.");
      setToastOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToastPrimitives.Provider swipeDirection="right">
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

              {error && (
                <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}

              {preview && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2 text-gray-700">
                    {validationResult
                      ? "Imagem Analisada:"
                      : "Pré-visualização:"}
                  </p>
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
              <h2 className="text-xl font-semibold mb-4">
                Resultado da Análise
              </h2>
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
                      {validationResult.data.plate}
                    </p>
                    <p>
                      <span className="font-medium">Local:</span>{" "}
                      {validationResult.data.location}
                    </p>
                    <p>
                      <span className="font-medium">Data/Hora:</span>{" "}
                      {validationResult.data.datetime}
                    </p>
                    <p>
                      <span className="font-medium">Infração:</span>{" "}
                      {validationResult.data.infraction}
                    </p>
                    <p>
                      <span className="font-medium">Tipo de Infração:</span>{" "}
                      {validationResult.data.gravity}
                    </p>
                  </>
                )}
              </div>
            </Card>
          )}

          {/* Seção Informativa (Mantida original) */}
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
                <h3 className="font-bold text-lg mb-2">
                  1. Localize a Infração
                </h3>
                <p className="text-gray-600 text-sm">
                  Identifique o veículo estacionado irregularmente (ex: rodas
                  sobre a calçada) e posicione-se para capturar o contexto.
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
                  Aproxime a câmera garantindo que a placa esteja nítida e
                  iluminada na foto para uma melhor leitura.
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
                <h3 className="font-bold text-lg mb-2">
                  3. Envie para Validar
                </h3>
                <p className="text-gray-600 text-sm">
                  Faça o upload da imagem neste painel. O sistema analisará
                  automaticamente se há infração e identificará a placa, se
                  possível.
                </p>
              </Card>
            </div>
          </div>
        </div>
        {/* Toast */}
        <ToastPrimitives.Root
          open={toastOpen}
          onOpenChange={setToastOpen}
          className={`fixed top-5 right-5 w-80 rounded-lg p-4 shadow-lg text-white ${
            toastVariant === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          <div className="flex justify-between items-center">
            <span>{toastMessage}</span>
            <ToastPrimitives.Close>
              <X className="h-5 w-5" />
            </ToastPrimitives.Close>
          </div>
        </ToastPrimitives.Root>
        <ToastPrimitives.Viewport />
      </div>
    </ToastPrimitives.Provider>
  );
}
