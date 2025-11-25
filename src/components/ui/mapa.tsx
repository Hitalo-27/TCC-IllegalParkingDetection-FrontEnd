"use client";

import { useEffect, useRef } from "react";

let mapsScriptLoaded = false;

declare global {
  interface Window {
    google: any;
  }
}

interface LocationItem {
  id: number;
  placa: string | null;
  latitude: number;
  longitude: number;
  rua: string;
  cidade: string;
  estado: string;
  data: string;
  imagem: string;
  user: string | null;
  pontos: string;
  infracao: string;
}

export function Mapa({
  locations = [],
  onMarkerClick,
}: {
  locations: LocationItem[];
  onMarkerClick?: (data: any) => void;
}) {
  console.log("Locations recebidas no Mapa:", locations);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const MAPS_API_KEY = "AIzaSyC4tvQ8YrjmP7mH3bNHsaNBJ-fRiG1bcEY";

  useEffect(() => {
    if (!MAPS_API_KEY) {
      console.error("Google Maps API key não encontrada.");
      return;
    }

    console.log(locations.length);

    if (locations.length === 0) {
      console.warn("Nenhuma localização recebida no componente Mapa.");
      return;
    }

    const initializeMap = () => {
      if (!window.google || !mapRef.current) return;

      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 4,
      });

      const bounds = new window.google.maps.LatLngBounds();

      locations.forEach((loc) => {
        const position = { lat: loc.latitude, lng: loc.longitude };

        bounds.extend(position);

        const marker = new window.google.maps.Marker({
          position,
          map,
          title: `${loc.rua}, ${loc.cidade}`,
        });

        const info = new window.google.maps.InfoWindow({
          content: `
        <div style="font-family: Arial; font-size: 14px; max-width: 220px;">
          <div style="font-size: 15px; font-weight: 600; color: #014643; margin-bottom: 6px;">
            ${loc.rua}, ${loc.cidade} - ${loc.estado}
          </div>

          ${
            loc.placa
              ? `
          <div style="margin-bottom: 4px;">
            <span style="font-weight: 600; color:#374151;">Placa:</span>
            <span style="color:#111827;"> ${loc.placa}</span>
          </div>
          `
              : ""
          }

          ${
            loc.user
              ? `
          <div style="margin-bottom: 4px;">
            <span style="font-weight: 600; color:#374151;">Registrado por:</span>
            <span style="color:#111827;"> ${loc.user}</span>
          </div>
          `
              : ""
          }
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

      // Ajustar o mapa para todos os marcadores
      map.fitBounds(bounds);

      // Caso haja apenas um marcador, aplicar zoom padrão
      if (locations.length === 1) {
        map.setCenter(bounds.getCenter());
        map.setZoom(16);
      }
    };

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
  }, [locations]);

  return <div ref={mapRef} className="w-full h-[500px] rounded-xl shadow-lg" />;
}
