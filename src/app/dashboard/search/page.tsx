"use client";

import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { useState } from "react";

// Dados simulados de infração
const mockInfraction = {
  plate: "ABC1234",
  images: [
    "https://images.unsplash.com/photo-1621799754526-a0d52c49fad5?q=80&w=800",
    "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=800",
  ],
  infractions: [
    {
      location: "Av. Paulista, 1000",
      datetime: "2024-03-20 14:30",
      reason: "Estacionamento em local proibido",
    },
    {
      location: "Rua Augusta, 500",
      datetime: "2024-03-19 16:45",
      reason: "Estacionamento em faixa de pedestres",
    },
  ],
};

export default function Search() {
  const [plate, setPlate] = useState("");
  const [searchResult, setSearchResult] = useState<typeof mockInfraction | null>(
    null
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulação de busca
    setSearchResult(mockInfraction);
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
                placeholder="ABC1234"
                className="mt-1"
                maxLength={7}
              />
            </div>
            <Button type="submit" className="self-end">
              Buscar
            </Button>
          </form>
        </Card>

        {searchResult && (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                Imagens do Veículo - Placa {searchResult.plate}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchResult.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Infração ${index + 1}`}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                Detalhes das Infrações
              </h2>
              <div className="space-y-4">
                {searchResult.infractions.map((infraction, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 rounded-lg space-y-2"
                  >
                    <p className="font-medium">Local: {infraction.location}</p>
                    <p>Data/Hora: {infraction.datetime}</p>
                    <p>Motivo: {infraction.reason}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}