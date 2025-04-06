"use client";

import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-900">
          Sistema de Monitoramento de Infrações
        </h1>
        <p className="text-lg text-gray-600">
          Consulte infrações de estacionamento através da placa do veículo
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => router.push("/login")}
            className="text-lg px-8 py-6"
          >
            Entrar
          </Button>
          <Button
            onClick={() => router.push("/register")}
            variant="outline"
            className="text-lg px-8 py-6"
          >
            Cadastrar
          </Button>
        </div>
      </div>
    </div>
  );
}