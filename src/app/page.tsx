"use client";

import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Camera,
  Zap,
  History,
  ArrowRight,
  LogIn,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white relative flex flex-col">
      {/* Fundo Decorativo (Dot Pattern) */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      {/* Header / Navbar Simples */}
      <header className="w-full border-b border-gray-100/50 bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-gray-900">
            <img 
              src="/car.png" 
              alt="IPD Logo" 
              className="w-8 h-8 object-contain" 
            />
            <span className="text-[hsl(var(--primary))]">IPD</span>
          </div>
          <div className="flex gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/login")}
              className="text-gray-600 hover:text-primary hover:bg-primary/5"
            >
              Login
            </Button>
            <Button
              onClick={() => router.push("/register")}
              className="hidden sm:flex bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
            >
              Criar Conta
            </Button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 pt-16 pb-24">
        {/* Hero Section */}
        <div className="max-w-4xl w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1]">
            Monitoramento inteligente de <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
              infrações de trânsito
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Identifique placas, valide infrações automaticamente com IA e
            gerencie ocorrências em um único painel intuitivo e seguro.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              onClick={() => router.push("/login")}
              className="h-12 px-8 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-transform hover:-translate-y-1"
            >
              Acessar Painel
              <LogIn className="ml-2 w-5 h-5" />
            </Button>
            <Button
              onClick={() => router.push("/register")}
              variant="outline"
              className="h-12 px-8 text-lg font-semibold border-gray-300 hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-transform hover:-translate-y-1"
            >
              Começar Agora
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 mt-20 max-w-6xl w-full px-4">
          <FeatureCard
            icon={<Camera className="w-8 h-8 text-blue-500" />}
            title="Envie Evidências"
            description="Upload simplificado de imagens para análise. Nosso sistema processa a foto instantaneamente."
            color="bg-blue-50 border-blue-100"
          />

          <FeatureCard
            icon={<Zap className="w-8 h-8 text-amber-500" />}
            title="Validação via IA"
            description="Algoritmos avançados detectam a placa, o modelo do veículo e o tipo de infração com alta precisão."
            color="bg-amber-50 border-amber-100"
          />

          <FeatureCard
            icon={<History className="w-8 h-8 text-green-500" />}
            title="Histórico Completo"
            description="Acompanhe o status de todas as infrações reportadas e mantenha um registro organizado."
            color="bg-green-50 border-green-100"
          />
        </div>
      </main>

      {/* Footer Simples */}
      <footer className="border-t py-8 text-center text-sm text-gray-500 bg-gray-50/50">
        <p>
          &copy; {new Date().getFullYear()} IPD - Detecção de Infrações. Todos
          os direitos reservados.
        </p>
      </footer>
    </div>
  );
}

// Componente auxiliar para os cards de funcionalidade
function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <Card className="border-0 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <CardHeader>
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${color}`}
        >
          {icon}
        </div>
        <CardTitle className="text-xl font-bold text-gray-900">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}
