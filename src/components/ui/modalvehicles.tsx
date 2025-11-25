"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  alt?: string;
}

export function ImageModal({
  isOpen,
  onClose,
  imageUrl,
  alt = "Imagem ampliada",
}: ImageModalProps) {
  // Hook para travar o scroll do body quando o modal estiver aberto
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  if (!isOpen || !imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Botão de fechar fixo no canto superior direito da tela */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors bg-white/10 hover:bg-white/20 rounded-full p-2 z-[110]"
        aria-label="Fechar zoom"
      >
        <X className="w-8 h-8" />
      </button>

      {/* Container da imagem */}
      <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
        <img
          src={imageUrl}
          alt={alt}
          className="max-h-[90vh] max-w-full object-contain rounded shadow-2xl pointer-events-auto"
          onClick={(e) => e.stopPropagation()} // Impede que o clique na imagem feche o modal
        />
      </div>
    </div>
  );
}