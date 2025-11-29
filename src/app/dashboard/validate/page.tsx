"use client";

import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { useState } from "react";
import { API_BASE_URL } from "@/src/config/env";
import {
  ReloadIcon,
  InfoCircledIcon,
  CheckCircledIcon,
  CrossCircledIcon,
} from "@radix-ui/react-icons";
import * as ToastPrimitives from "@radix-ui/react-toast";
import {
  X,
  MapPin,
  Calendar,
  AlertTriangle,
  FileText,
  Search,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { ImageModal } from "@/src/components/ui/modalvehicles";
import { Mapa } from "@/src/components/ui/mapa";
import ModalInfraction from "@/src/components/ui/modalinfractions";
import { useRouter } from "next/navigation";

export default function Validate() {
  const router = useRouter();
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
        router.push("/login?error=unauthorized");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_BASE_URL}/plate/identification`, {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        setLoading(false);
        router.push("/login?error=unauthorized");
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
      <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Cabeçalho */}
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900">
              Validação de Infrações
            </h1>
            <p className="text-gray-500 mt-2">
              Faça o upload da imagem para análise automática.
            </p>
          </div>
          
          <ToastPrimitives.Viewport />

          <Card className="p-6 md:p-8 shadow-md border-gray-200 bg-white">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Área de Input */}
              <div className="space-y-2">
                <Label
                  htmlFor="file"
                  className="text-base font-semibold text-gray-700"
                >
                  Selecionar Imagem
                </Label>
                <div className="flex gap-4 items-center">
                  <Input
                    id="file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="cursor-pointer file:bg-blue-50 file:text-blue-700 file:border-0 file:rounded-md hover:file:bg-blue-100 transition-colors"
                  />
                  <Button
                    type="submit"
                    disabled={!file || loading}
                    className="min-w-[140px]"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <ReloadIcon className="h-4 w-4 animate-spin" />
                        Enviando...
                      </div>
                    ) : (
                      "Validar Agora"
                    )}
                  </Button>
                </div>
                <p className="text-sm text-gray-400">
                  Formatos aceitos: JPG, PNG
                </p>
              </div>
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  {error}
                </div>
              )}

              {/* Área Principal: Grid Imagem + Resultado */}
              {preview && (
                <div className="mt-8 pt-8 border-t border-gray-100 animate-in fade-in zoom-in duration-300">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                    <div className="flex flex-col h-full space-y-3">
                      <Label className="text-gray-500 font-medium ml-1">
                        {validationResult
                          ? "Imagem Analisada"
                          : "Pré-visualização"}
                      </Label>
                      <div
                        className="relative group cursor-zoom-in w-full h-full flex-1 bg-primary rounded-xl overflow-hidden shadow-lg border border-gray-200 flex items-center justify-center"
                        onClick={() => setIsModalOpen(true)}
                      >
                        <img
                          src={preview}
                          alt="Preview"
                          className="max-w-full max-h-96 object-contain transition-opacity group-hover:opacity-80"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/40">
                          <span className="text-white text-sm font-medium bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 shadow-xl flex items-center gap-2">
                            <Search className="w-4 h-4" /> Ampliar Imagem
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* COLUNA DO RESULTADO */}
                    <div className="flex flex-col h-full">
                      <Label className="text-gray-500 font-medium ml-1 mb-3">
                        Relatório da Análise
                      </Label>

                      {!validationResult ? (
                        <div className="flex-1 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center p-8 text-center bg-gray-50/50">
                          <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                            <FileText className="w-6 h-6 text-gray-300" />
                          </div>
                          <h3 className="text-gray-900 font-medium">
                            Aguardando Validação
                          </h3>
                          <p className="text-sm text-gray-500 max-w-xs mt-1">
                            Clique no botão{" "}
                            <b className="text-primary">Validar Agora</b> para
                            processar a imagem e ver os detalhes aqui.
                          </p>
                        </div>
                      ) : (
                        <Card
                          className={`flex-1 flex flex-col overflow-hidden border transition-all shadow-md ${
                            validationResult.hasInfraction
                              ? "border-red-200 bg-red-50/30"
                              : "border-green-200 bg-green-50/30"
                          }`}
                        >
                          <div
                            className={`p-4 border-b flex items-center gap-3 shrink-0 ${
                              validationResult.hasInfraction
                                ? "bg-red-100/50 border-red-200 text-red-800"
                                : "bg-green-100/50 border-green-200 text-green-800"
                            }`}
                          >
                            {validationResult.hasInfraction ? (
                              <CrossCircledIcon className="w-6 h-6" />
                            ) : (
                              <CheckCircledIcon className="w-6 h-6" />
                            )}
                            <div>
                              <h3 className="font-bold text-lg leading-tight">
                                {validationResult.hasInfraction
                                  ? "Infração Detectada"
                                  : "Regular"}
                              </h3>
                              <p className="text-xs opacity-80">
                                {validationResult.hasInfraction
                                  ? "Atenção requerida para os dados abaixo."
                                  : "Nenhuma irregularidade encontrada."}
                              </p>
                            </div>
                          </div>

                          <div className="p-5 space-y-4 flex-1 overflow-y-auto">
                            {validationResult.hasInfraction && (
                              <>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                    <span className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1 block">
                                      Placa - Cor
                                    </span>
                                    <div className="text-xl font-mono font-bold text-gray-800">
                                      {validationResult.data.veiculo
                                        ?.placa_numero || "---"} - {validationResult.data.veiculo?.cor || "---"}
                                    </div>
                                  </div>

                                  <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                    <span className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1 block">
                                      Gravidade
                                    </span>
                                    <div className="flex items-center gap-2">
                                      <span
                                        className={`px-2 py-0.5 rounded text-xs font-bold ${
                                          validationResult.data.tipo_infracao
                                            ?.gravidade === "Gravíssima"
                                            ? "bg-red-100 text-red-700"
                                            : validationResult.data
                                                .tipo_infracao?.gravidade ===
                                              "Grave"
                                            ? "bg-orange-100 text-orange-700"
                                            : "bg-yellow-100 text-yellow-700"
                                        }`}
                                      >
                                        {validationResult.data.tipo_infracao
                                          ?.gravidade || "N/A"}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-3 pt-2">
                                  <div className="flex items-start gap-3 text-sm text-gray-700">
                                    <AlertTriangle className="w-4 h-4 mt-0.5 text-orange-500 shrink-0" />
                                    <div>
                                      <span className="font-semibold block text-gray-900">
                                        Tipo da Infração
                                      </span>
                                      {
                                        validationResult.data.tipo_infracao
                                          ?.descricao
                                      }
                                    </div>
                                  </div>

                                  <div className="flex items-start gap-3 text-sm text-gray-700">
                                    <MapPin className="w-4 h-4 mt-0.5 text-blue-500 shrink-0" />
                                    <div>
                                      <span className="font-semibold block text-gray-900">
                                        Localização
                                      </span>
                                      {validationResult.data.endereco
                                        ? `${validationResult.data.endereco?.rua}, ${validationResult.data.endereco?.cidade} - ${validationResult.data.endereco?.estado}`
                                        : "Endereço não identificado"}
                                    </div>
                                  </div>

                                  <div className="flex items-start gap-3 text-sm text-gray-700">
                                    <Calendar className="w-4 h-4 mt-0.5 text-purple-500 shrink-0" />
                                    <div>
                                      <span className="font-semibold block text-gray-900">
                                        Data e Hora
                                      </span>
                                      {validationResult.data.data
                                        ? new Date(
                                            validationResult.data.data
                                          ).toLocaleString("pt-BR")
                                        : "Data não disponível"}
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </Card>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </form>
          </Card>

          {validationResult && validationResult.hasInfraction && (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <Mapa
                locations={[
                  {
                    id: Math.random(),
                    placa: validationResult.data.veiculo?.placa_numero,
                    latitude: Number(validationResult.data.endereco?.latitude),
                    longitude: Number(
                      validationResult.data.endereco?.longitude
                    ),
                    rua: validationResult.data.endereco?.rua,
                    cidade: validationResult.data.endereco?.cidade,
                    estado: validationResult.data.endereco?.estado,
                    data: new Date(validationResult.data.data).toLocaleString(
                      "pt-BR"
                    ),
                    imagem: `${API_BASE_URL}${validationResult.data.imagem}`,
                    user: validationResult.data.user?.username,
                    pontos: String(validationResult.data.tipo_infracao?.pontos),
                    infracao: validationResult.data.tipo_infracao?.descricao,
                  },
                ]}
                onMarkerClick={(data) => setSelectedInfraction(data)}
              />
            </div>
          )}

          {/* Seção Informativa */}
          <div className="pt-4 border-t border-gray-200 mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center justify-center gap-2">
              <InfoCircledIcon className="w-6 h-6" />
              Como funciona
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        <ImageModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          imageUrl={preview}
        />

        {/* Modern Toast */}
        <ToastPrimitives.Root
          open={toastOpen}
          onOpenChange={setToastOpen}
          className={`
            fixed top-5 right-5 z-50 
            flex items-center gap-3 
            w-auto max-w-sm rounded-xl p-4 shadow-2xl 
            border animate-in slide-in-from-right-full fade-in duration-300
            ${toastVariant === "success" 
              ? "bg-white border-green-200 text-green-800" 
              : "bg-white border-red-200 text-red-800"
            }
          `}
        >
          <div className={`p-2 rounded-full ${toastVariant === "success" ? "bg-green-100" : "bg-red-100"}`}>
            {toastVariant === "success" ? (
               <CheckCircle2 className="h-5 w-5" />
            ) : (
               <AlertCircle className="h-5 w-5" />
            )}
          </div>
          
          <div className="flex-1">
             <h3 className="font-semibold text-sm">
                {toastVariant === "success" ? "Sucesso" : "Erro"}
             </h3>
             <p className="text-sm opacity-90">{toastMessage}</p>
          </div>

          <ToastPrimitives.Close className="text-gray-400 hover:text-gray-600">
            <X className="h-4 w-4" />
          </ToastPrimitives.Close>
        </ToastPrimitives.Root>

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
