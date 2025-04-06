"use client";

import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Painel de Controle
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-4">Consultar Infrações</h2>
            <p className="text-gray-600 mb-6">
              Pesquise infrações por placa do veículo e visualize detalhes completos
              incluindo imagens e localização.
            </p>
            <Button
              onClick={() => router.push("/dashboard/search")}
              className="w-full"
              size="lg"
            >
              Acessar Consulta
            </Button>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-4">Validar Infração</h2>
            <p className="text-gray-600 mb-6">
              Envie imagens ou vídeos para análise automática de infrações
              de estacionamento.
            </p>
            <Button
              onClick={() => router.push("/dashboard/validate")}
              className="w-full"
              size="lg"
            >
              Acessar Validação
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}