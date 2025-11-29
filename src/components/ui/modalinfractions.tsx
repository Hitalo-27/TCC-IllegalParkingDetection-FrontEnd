"use client";

import React from "react";
import { 
  X, 
  MapPin, 
  Calendar, 
  AlertTriangle, 
  User, 
  FileWarning, 
  Map
} from "lucide-react";

interface InfractionData {
  placa: string | null;
  imagem: string;
  rua: string;
  cidade: string;
  estado: string;
  user: string | null;
  data: string;
  infracao: string;
  pontos: string | number;
}

interface ModalInfractionProps {
  selectedImage?: string | null;
  selectedInfraction?: InfractionData | null;
  closeModal: () => void;
  handleModalClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function ModalInfraction({
  selectedImage,
  selectedInfraction,
  closeModal,
  handleModalClick,
}: ModalInfractionProps) {
  if (!selectedImage && !selectedInfraction) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-50 p-4 animate-in fade-in duration-200"
      onClick={handleModalClick}
    >
      <div
        className="
          relative bg-white rounded-2xl shadow-2xl overflow-hidden
          max-w-4xl w-full max-h-[90vh] flex flex-col
          animate-in zoom-in-95 duration-200
        "
      >
        {/* Header com Botão Fechar */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={closeModal}
            className="bg-white/90 hover:bg-white text-gray-700 hover:text-red-600 rounded-full p-2 shadow-sm border border-gray-200 transition-all duration-200"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {selectedInfraction ? (
          <div className="flex flex-col md:flex-row h-full overflow-hidden">
            
            {/* Lado Esquerdo: Imagem */}
            <div className="md:w-1/2 bg-gray-100 flex items-center justify-center p-4 md:p-0 overflow-hidden relative group">
              <img
                src={selectedInfraction.imagem}
                alt="Infração"
                className="max-h-[40vh] md:max-h-full w-full object-contain md:object-cover transition-transform duration-500 group-hover:scale-105"
              />
               {/* Overlay da Placa na Imagem */}
               {selectedInfraction.placa && (
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-md shadow-lg border border-gray-200">
                  <p className="font-mono font-bold text-gray-900 text-lg">
                    {selectedInfraction.placa}
                  </p>
                </div>
              )}
            </div>

            {/* Lado Direito: Detalhes com Scroll se necessário */}
            <div className="md:w-1/2 flex flex-col h-full bg-white">
              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
                
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <FileWarning className="w-6 h-6 text-red-600" />
                    Detalhes da Infração
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Visualização completa dos dados registrados.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Bloco de Gravidade/Pontos */}
                  <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-red-900">Motivo da Infração</h3>
                      <p className="text-red-700 text-sm mt-1">{selectedInfraction.infracao}</p>
                      <span className="inline-block mt-2 bg-white text-red-700 text-xs font-bold px-2 py-1 rounded border border-red-200">
                        {selectedInfraction.pontos} Pontos na CNH
                      </span>
                    </div>
                  </div>

                  {/* Grid de Informações */}
                  <div className="grid grid-cols-1 gap-4">
                    
                    <InfoItem 
                      icon={<Calendar className="w-4 h-4 text-blue-500" />}
                      label="Data e Hora"
                      value={selectedInfraction.data}
                    />

                    <InfoItem 
                      icon={<MapPin className="w-4 h-4 text-orange-500" />}
                      label="Localização"
                      value={selectedInfraction.rua}
                      subValue={`${selectedInfraction.cidade} - ${selectedInfraction.estado}`}
                    />

                    {selectedInfraction.user && (
                      <InfoItem 
                        icon={<User className="w-4 h-4 text-purple-500" />}
                        label="Agente Registrador"
                        value={selectedInfraction.user}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Visualização Apenas da Imagem (Zoom)
          <div className="p-2 flex items-center justify-center bg-gray-900 h-full min-h-[50vh]">
             <img
              src={selectedImage!}
              alt="Imagem Ampliada"
              className="max-h-[85vh] max-w-full object-contain rounded shadow-2xl"
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Subcomponente para itens da lista (para limpar o código principal)
function InfoItem({ icon, label, value, subValue }: { icon: React.ReactNode, label: string, value: string, subValue?: string }) {
  return (
    <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group">
      <div className="mt-1 p-2 bg-white rounded-full border shadow-sm group-hover:border-gray-300 transition-colors">
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="font-medium text-gray-900">{value}</p>
        {subValue && <p className="text-sm text-gray-600">{subValue}</p>}
      </div>
    </div>
  );
}