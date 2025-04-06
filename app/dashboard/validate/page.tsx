"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

// Dados simulados de resultado da validação
const mockValidationResult = {
  hasInfraction: true,
  plate: "XYZ5678",
  location: "Rua Oscar Freire, 123",
  datetime: "2024-03-21 15:45",
  infraction: "Estacionamento em vaga de idoso sem credencial",
};

export default function Validate() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<typeof mockValidationResult | null>(
    null
  );

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulação de validação
    setValidationResult(mockValidationResult);
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
              <Label htmlFor="file">Enviar Imagem ou Vídeo</Label>
              <Input
                id="file"
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                Formatos aceitos: JPG, PNG, MP4, MOV
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

            <Button type="submit" className="w-full" disabled={!file}>
              Validar
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
                <div className={`w-3 h-3 rounded-full ${
                  validationResult.hasInfraction ? 'bg-red-500' : 'bg-green-500'
                }`} />
                <p className="font-medium">
                  {validationResult.hasInfraction
                    ? 'Infração Detectada'
                    : 'Nenhuma Infração Detectada'}
                </p>
              </div>
              {validationResult.hasInfraction && (
                <>
                  <p><span className="font-medium">Placa:</span> {validationResult.plate}</p>
                  <p><span className="font-medium">Local:</span> {validationResult.location}</p>
                  <p><span className="font-medium">Data/Hora:</span> {validationResult.datetime}</p>
                  <p><span className="font-medium">Infração:</span> {validationResult.infraction}</p>
                </>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}