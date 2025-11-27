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
import { ImageModal } from "@/src/components/ui/modalvehicles";
import { Mapa } from "@/src/components/ui/mapa";
import ModalInfraction from "@/src/components/ui/modalinfractions";
import { useRouter } from "next/navigation";

export default function Validate() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [toastVariant, setToastVariant] = useState<"success" | "error">(
    "error"
  );
  const [selectedInfraction, setSelectedInfraction] = useState<any | null>(
    null
  );
  const [validationResult, setValidationResult] = useState<any | null>(null);

  // Estado simples apenas para controlar abrir/fechar
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setValidationResult(null);

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
        setLoading(false);
        router.push('/login?error=unauthorized')
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_BASE_URL}/plate/identification`, {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });

      // Se der 401 é certeza que o token expirou
      if (response.status === 401) {
        setLoading(false);
        router.push('/login?error=unauthorized')
        return;
      }

      const data = await response.json();

      if (data.success === true) {
        setValidationResult(data);
        setToastVariant("success");
        setToastMessage("Imagem processada com sucesso!");
        setToastOpen(true);

        if (data.data && data.data.imagem) {
          const baseUrl = API_BASE_URL.replace(/\/$/, "");
          setPreview(`${baseUrl}${data.data.imagem}`);
        }
      } else {
        const msg = data.message || "Erro ao processar a imagem.";
        setToastVariant("error");
        setToastMessage(msg);
        setToastOpen(true);
        setValidationResult(null);
      }
    } catch (error: any) {
      console.error(error.message);
      setToastVariant("error");
      setToastMessage("Erro de conexão com o servidor.");
      setToastOpen(true);
    } finally {
      setLoading(false);
    }
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

                  {/* Container clicável da imagem pequena */}
                  <div
                    className="relative group cursor-zoom-in w-fit mx-auto"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-h-64 rounded-lg mx-auto transition-opacity hover:opacity-90"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-lg">
                      <span className="text-white text-sm font-medium bg-black/50 px-2 py-1 rounded">
                        Clique para ampliar
                      </span>
                    </div>
                  </div>
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
            <>
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
                        {validationResult.data.veiculo.placa_numero}
                      </p>
                      <p>
                        <span className="font-medium">Local:</span>{" "}
                        {validationResult.data.endereco
                          ? `${validationResult.data.endereco?.rua}, ${validationResult.data.endereco?.cidade} - ${validationResult.data.endereco?.estado}`
                          : "Não disponível"}
                      </p>
                      <p>
                        <span className="font-medium">Data/Hora:</span>{" "}
                        {validationResult.data.data
                          ? new Date(validationResult.data.data).toLocaleString(
                              "pt-BR"
                            )
                          : "Não disponível"}
                      </p>
                      <p>
                        <span className="font-medium">Infração:</span>{" "}
                        {validationResult.data.tipo_infracao.descricao}
                      </p>
                      <p>
                        <span className="font-medium">Tipo de Infração:</span>{" "}
                        {validationResult.data.tipo_infracao.gravidade}
                      </p>
                    </>
                  )}
                </div>
              </Card>

              {validationResult.hasInfraction && (
                <>
                  <Mapa
                    locations={[
                      {
                        id: Math.random(),
                        placa: validationResult.data.veiculo?.placa_numer,
                        latitude: Number(
                          validationResult.data.endereco?.latitude
                        ),
                        longitude: Number(
                          validationResult.data.endereco?.longitude
                        ),
                        rua: validationResult.data.endereco?.rua,
                        cidade: validationResult.data.endereco?.cidade,
                        estado: validationResult.data.endereco?.estado,
                        data: new Date(
                          validationResult.data.data
                        ).toLocaleString("pt-BR"),
                        imagem: `${API_BASE_URL}${validationResult.data.imagem}`,
                        user: validationResult.data.user?.username,
                        pontos: String(
                          validationResult.data.tipo_infracao?.pontos
                        ),
                        infracao:
                          validationResult.data.tipo_infracao?.descricao,
                      },
                    ]}
                    onMarkerClick={(data) => setSelectedInfraction(data)}
                  />
                </>
              )}
            </>
          )}

          {/* Seção Informativa */}
          <div className="pt-4 border-t border-gray-200 mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center justify-center gap-2">
              <InfoCircledIcon className="w-6 h-6" />
              Como funciona
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Cards informativos mantidos iguais... */}
              <Card className="p-4 flex flex-col items-center text-center h-full hover:scale-105 transition-transform">
                <div className="w-full relative mb-4 bg-gray-100 rounded-md overflow-hidden">
                  <img
                    src="/foto1.png"
                    alt="Exemplo 1"
                    className="object-cover w-full h-full"
                  />
                </div>
                <h3 className="font-bold text-lg mb-2">
                  1. Localize a Infração
                </h3>
                <p className="text-gray-600 text-sm">
                  Identifique o veículo estacionado irregularmente.
                </p>
              </Card>
              <Card className="p-4 flex flex-col items-center text-center h-full hover:scale-105 transition-transform">
                <div className="w-full relative mb-4 bg-gray-100 rounded-md overflow-hidden">
                  <img
                    src="/foto2.png"
                    alt="Exemplo 2"
                    className="object-cover w-full h-full"
                  />
                </div>
                <h3 className="font-bold text-lg mb-2">2. Foque na Placa</h3>
                <p className="text-gray-600 text-sm">
                  Garanta que a placa esteja nítida e iluminada.
                </p>
              </Card>
              <Card className="p-4 flex flex-col items-center text-center h-full hover:scale-105 transition-transform">
                <div className="w-full relative mb-4 bg-gray-100 rounded-md overflow-hidden">
                  <img
                    src="/foto3.png"
                    alt="Exemplo 3"
                    className="object-cover w-full h-full"
                  />
                </div>
                <h3 className="font-bold text-lg mb-2">
                  3. Envie para Validar
                </h3>
                <p className="text-gray-600 text-sm">
                  Faça o upload e o sistema analisará automaticamente.
                </p>
              </Card>
            </div>
          </div>
        </div>

        {/* --- AQUI ESTÁ SEU NOVO COMPONENTE --- */}
        <ImageModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          imageUrl={preview}
        />

        {/* Toast Notification */}
        <ToastPrimitives.Root
          open={toastOpen}
          onOpenChange={setToastOpen}
          className={`fixed top-5 right-5 w-80 rounded-lg p-4 shadow-lg text-white z-[120] ${
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
        {/* 4. Modal exclusivo para Detalhes do Mapa */}
        <ModalInfraction
          selectedImage={null}
          selectedInfraction={selectedInfraction}
          closeModal={closeModal}
          handleModalClick={handleModalClick}
        />
      </div>
    </ToastPrimitives.Provider>
  );
}
