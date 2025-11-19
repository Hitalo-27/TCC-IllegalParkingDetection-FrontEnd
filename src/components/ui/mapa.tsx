"use client";

import { useEffect, useRef } from "react";

let mapsScriptLoaded = false; // 👈 EVITA CARREGAR GOOGLE MAPS MAIS DE UMA VEZ

const mockLocations = [
  {
    id: 1,
    latitude: -23.55052,
    longitude: -46.633308,
    rua: "Av. Paulista",
    cidade: "São Paulo",
    estado: "SP",
    data: "29/10/2025, 03:57:48",
    imagem: "http://localhost:8000/uploads/car.png",
    user: "Carlos Algusto",
    pontos: "04",
    infracao : "Estacionado sob placa de proibido",
  },
];

declare global {
  interface Window {
    google: any;
  }
}

export function Mapa({ onMarkerClick }: { onMarkerClick?: (data: any) => void }) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const MAPS_API_KEY = "AIzaSyC4tvQ8YrjmP7mH3bNHsaNBJ-fRiG1bcEY";

  useEffect(() => {
    if (!MAPS_API_KEY) {
      console.error("Google Maps API key não encontrada.");
      return;
    }

    const initializeMap = () => {
      if (!window.google || !mapRef.current) return;

      const map = new window.google.maps.Map(mapRef.current, {
        center: {
          lat: mockLocations[0].latitude,
          lng: mockLocations[0].longitude,
        },
        zoom: 14,
      });

      mockLocations.forEach((loc) => {
        const marker = new window.google.maps.Marker({
          position: { lat: loc.latitude, lng: loc.longitude },
          map,
          title: `${loc.rua}, ${loc.cidade}`,
        });

        const info = new window.google.maps.InfoWindow({
          content: `
            <div style="font-family: Arial; font-size: 14px; max-width: 220px;">
              <div style="font-size: 15px; font-weight: 600; color: #014643; margin-bottom: 6px;">
                ${loc.rua}, ${loc.cidade} - ${loc.estado}
              </div>

              <div style="margin-bottom: 4px;">
                <span style="font-weight: 600; color:#374151;">Registrado por:</span>
                <span style="color:#111827;"> ${loc.user}</span>
              </div>

              <div style="margin-bottom: 6px;">
                <span style="font-weight: 600; color:#374151;">Data:</span>
                <span style="color:#111827;"> ${loc.data}</span>
              </div>

              <img 
                id="img-${loc.id}"
                src="${loc.imagem}"
                width="200"
                style="border-radius: 8px; margin-top: 6px; 
                box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                display: block; cursor:pointer;"
              />
            </div>
          `,
        });

        marker.addListener("click", () => {
          info.open({ anchor: marker, map });

          // Aguarda o InfoWindow renderizar
          window.google.maps.event.addListenerOnce(info, "domready", () => {
            const img = document.getElementById(`img-${loc.id}`);
            if (img) {
              img.addEventListener("click", () => {
                if (onMarkerClick) onMarkerClick(loc);
              });
            }
          });
        });
      });
    };

    // 🚨 GARANTE QUE O SCRIPT SÓ É CARREGADO UMA VEZ!
    if (!window.google && !mapsScriptLoaded) {
      mapsScriptLoaded = true;
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}`;
      script.async = true;
      script.onload = initializeMap;
      document.body.appendChild(script);
    } else if (window.google) {
      initializeMap();
    }
  }, []);

  return (
    <div
      ref={mapRef}
      className="w-full h-[500px] rounded-xl shadow-lg"
    />
  );
}
