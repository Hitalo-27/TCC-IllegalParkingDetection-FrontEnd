"use client";

import { 
  Camera, 
  ScanFace, 
  Ruler, 
  ScanText, 
  Database, 
  ArrowRight 
} from "lucide-react";

export function ArchitectureFlow() {
  const architectureSteps = [
    {
      step: "01",
      title: "Captura & Input",
      subtitle: "Monitoramento",
      description: "Monitoramento contínuo e aquisição de frames via câmeras.",
      icon: Camera,
      color: "bg-slate-100 text-slate-700",
      badgeColor: "bg-slate-200 text-slate-800"
    },
    {
      step: "02",
      title: "Detecção IA",
      subtitle: "YOLOv11",
      description: "Processamento visual utilizando o modelo SOTA YOLOv11.",
      icon: ScanFace,
      color: "bg-blue-50 text-blue-600",
      badgeColor: "bg-blue-100 text-blue-700"
    },
    {
      step: "03",
      title: "Validação Lógica",
      subtitle: "Algoritmo Espacial",
      description: "Verificação de regras de estacionamento (calçada/faixa/placa).",
      icon: Ruler,
      color: "bg-orange-50 text-orange-600",
      badgeColor: "bg-orange-100 text-orange-700"
    },
    {
      step: "04",
      title: "Extração ALPR",
      subtitle: "OCR & Metadata",
      description: "Leitura automática de placas e extração de dados.",
      icon: ScanText,
      color: "bg-purple-50 text-purple-600",
      badgeColor: "bg-purple-100 text-purple-700"
    },
    {
      step: "05",
      title: "Ação & Registro",
      subtitle: "API REST / MySQL",
      description: "Persistência dos dados e disponibilização via API.",
      icon: Database,
      color: "bg-emerald-50 text-emerald-600",
      badgeColor: "bg-emerald-100 text-emerald-700"
    },
  ];

  return (
    <section className="bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-gray-900">
          Arquitetura de Processamento
        </h2>
        <p className="text-gray-500 mt-2 max-w-2xl mx-auto text-sm md:text-base">
          Fluxo automatizado baseado na arquitetura proposta no TCC, integrando Visão Computacional e Lógica de Validação conforme as regras do CTB.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {architectureSteps.map((item, index) => (
          <div 
            key={index} 
            className="group relative flex flex-col items-center text-center space-y-4"
          >
            {/* Círculo do Ícone com Efeito Hover */}
            <div className={`
              relative w-20 h-20 rounded-full flex items-center justify-center 
              transition-all duration-300 group-hover:scale-110 group-hover:shadow-md
              ${item.color}
            `}>
              <item.icon className="w-8 h-8" />
              
              {/* Badge Pequeno (ex: Monitoramento) */}
              <span className="absolute -bottom-3 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-white border border-gray-100 shadow-sm rounded-full text-gray-600 whitespace-nowrap">
                {item.subtitle}
              </span>
            </div>

            {/* Seta de Conexão (Escondida no Mobile e no último item) */}
            {index < architectureSteps.length - 1 && (
              <div className="hidden lg:block absolute top-8 -right-1/2 w-full text-gray-300 z-0 pointer-events-none">
                 <ArrowRight className="w-6 h-6 mx-auto opacity-50" />
              </div>
            )}

            {/* Conteúdo Textual */}
            <div className="z-10 bg-white pt-2">
              <p className={`text-xs font-bold mb-1 tracking-widest uppercase ${item.badgeColor.replace('bg-', 'text-').replace('100', '600')}`}>
                PASSO {item.step}
              </p>
              <h3 className="font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed px-1">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}