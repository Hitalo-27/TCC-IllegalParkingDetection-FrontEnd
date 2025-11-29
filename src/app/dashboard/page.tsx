"use client";

import { useRouter } from "next/navigation";
import { 
  Search, 
  CheckCircle2, 
  Target, 
  Layers, 
  Database, 
  Cpu, 
  ArrowRight,
  Activity
} from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { ArchitectureFlow } from "@/src/components/ui/architectureflow";

export default function Dashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      
      {/* Cabeçalho do Painel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-7xl mx-auto">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Visão Geral
          </h1>
          <p className="text-gray-500">
            Monitoramento e processamento de infrações em tempo real.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Seção: Arquitetura do Sistema */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <Activity className="w-5 h-5 text-primary" />
            <h2>Fluxo de Processamento</h2>
          </div>
          <div className="bg-white rounded-xl border shadow-sm p-6 overflow-hidden relative">
            {/* Background decorativo sutil atrás do fluxo */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />
            <ArchitectureFlow />
          </div>
        </section>

        {/* Seção: Ações Rápidas (Cards Principais) */}
        <section className="grid md:grid-cols-2 gap-6">
          
          {/* Card Consulta */}
          <Card className="group relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={() => router.push("/dashboard/search")}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="pb-2">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600 group-hover:scale-110 transition-transform">
                <Search className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl">Consultar Infrações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-500 leading-relaxed">
                Acesse o banco de dados para buscar infrações por placa, visualizar evidências fotográficas e localização no mapa.
              </p>
              <Button 
                onClick={() => router.push("/dashboard/search")}
                className="w-full bg-white text-blue-600 border-2 border-blue-100 hover:bg-blue-50 hover:border-blue-200 shadow-none justify-between group-hover:pr-4 transition-all"
              >
                Iniciar Pesquisa
                <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </Button>
            </CardContent>
          </Card>

          {/* Card Validação */}
          <Card className="group relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={() => router.push("/dashboard/validate")}>
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="pb-2">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 text-green-600 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl">Validar Nova Infração</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-500 leading-relaxed">
                Submeta novas imagens para análise da IA. O sistema detectará automaticamente a placa, veículo e o tipo de infração.
              </p>
              <Button 
                onClick={() => router.push("/dashboard/validate")}
                className="w-full bg-white text-green-600 border-2 border-green-100 hover:bg-green-50 hover:border-green-200 shadow-none justify-between group-hover:pr-4 transition-all"
              >
                Nova Análise
                <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Seção: Métricas do Sistema */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-gray-500" />
            Métricas do Modelo
          </h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              icon={<Target className="w-5 h-5 text-blue-600" />}
              value="85%"
              label="Precisão Média (mAP)"
              bg="bg-blue-50"
              border="border-blue-100"
            />
            <StatCard 
              icon={<Layers className="w-5 h-5 text-purple-600" />}
              value="YOLOv11"
              label="Arquitetura SOTA"
              bg="bg-purple-50"
              border="border-purple-100"
            />
            <StatCard 
              icon={<Database className="w-5 h-5 text-orange-600" />}
              value="800+"
              label="Dataset de Treino"
              bg="bg-orange-50"
              border="border-orange-100"
            />
            <StatCard 
              icon={<CheckCircle2 className="w-5 h-5 text-green-600" />}
              value="3 Tipos"
              label="Infrações Detectáveis"
              bg="bg-green-50"
              border="border-green-100"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

// Componente para Cards de Estatística
function StatCard({ icon, value, label, bg, border }: { icon: React.ReactNode, value: string, label: string, bg: string, border: string }) {
  return (
    <Card className={`border ${border} shadow-sm hover:shadow-md transition-shadow`}>
      <CardContent className="p-4 flex items-center gap-4">
        <div className={`p-3 rounded-lg ${bg}`}>
          {icon}
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}