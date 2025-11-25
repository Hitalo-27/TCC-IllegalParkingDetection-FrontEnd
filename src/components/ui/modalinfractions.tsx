"use client";

import React from "react";

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
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 px-4"
      onClick={handleModalClick}
    >
      <div
        className="
          relative bg-white rounded-2xl shadow-2xl p-6 
          max-w-3xl w-full
          max-h-[90vh]
          flex flex-col
          border border-gray-200
        "
      >
        {selectedInfraction ? (
          <div className="flex flex-col items-center flex-grow">
            <img
              src={selectedInfraction.imagem}
              className="
                rounded-xl 
                max-h-[45vh] 
                w-auto
                object-contain 
                border border-gray-200 shadow-sm mb-5
              "
            />

            <h2 className="text-2xl font-bold text-[hsl(var(--primary))] mb-1">
              Detalhes da Infração
            </h2>

            <div className="h-[2px] w-24 bg-[hsl(var(--primary))]/30 rounded mb-4"></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full text-gray-800">
              {/* ESQUERDA */}
              <div className="space-y-1">
                {selectedInfraction.placa && (
                  <p>
                    <span className="font-semibold text-gray-700">Placa:</span>{" "}
                    <span>{selectedInfraction.placa}</span>
                  </p>
                )}
                <p>
                  <span className="font-semibold text-gray-700">Local:</span>{" "}
                  <span>{selectedInfraction.rua}</span>
                </p>

                <p>
                  <span className="font-semibold text-gray-700">Cidade:</span>{" "}
                  <span>{selectedInfraction.cidade}</span>
                </p>

                <p>
                  <span className="font-semibold text-gray-700">Estado:</span>{" "}
                  <span>{selectedInfraction.estado}</span>
                </p>

                {selectedInfraction.user && (
                  <p>
                    <span className="font-semibold text-gray-700">
                      Registrado por:
                    </span>{" "}
                    <span>{selectedInfraction.user}</span>
                  </p>
                )}
              </div>

              {/* DIREITA */}
              <div className="space-y-1">
                <p>
                  <span className="font-semibold text-gray-700">Data:</span>{" "}
                  <span>{selectedInfraction.data}</span>
                </p>

                <p>
                  <span className="font-semibold text-gray-700">Infração:</span>{" "}
                  <span>{selectedInfraction.infracao}</span>
                </p>

                <p>
                  <span className="font-semibold text-gray-700">Pontos:</span>{" "}
                  <span>{selectedInfraction.pontos}</span>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <img
            src={selectedImage!}
            alt="Imagem Ampliada"
            className="rounded-lg max-h-[80vh] max-w-[85vw] object-contain"
          />
        )}

        {/* Botão de fechar */}
        <button
          onClick={closeModal}
          className="
            absolute -top-4 -right-4 bg-white shadow-lg 
            text-gray-700 font-bold rounded-full 
            w-10 h-10 flex items-center justify-center 
            hover:bg-gray-100 transition border
          "
        >
          ✕
        </button>
      </div>
    </div>
  );
}