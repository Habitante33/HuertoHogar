import React, { useEffect, useRef } from 'react';

export default function MapaHuerto() {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);

    useEffect(() => {
        // Asegurarse de que Leaflet (L) está cargado globalmente desde el CDN de index.html
        if (typeof window.L === 'undefined') return;

        const L = window.L;

        // Limpiar el mapa si ya estaba inicializado
        if (mapInstance.current) {
            mapInstance.current.remove();
            mapInstance.current = null;
        }

        const sucursales = [
            { ciudad: "Santiago", lat: -33.4489, lng: -70.6693, desc: "Casa Matriz y Distribución Central" },
            { ciudad: "Viña del Mar", lat: -33.0245, lng: -71.5518, desc: "Sucursal Viña del Mar" },
            { ciudad: "Valparaíso", lat: -33.0472, lng: -71.6127, desc: "Punto de Reparto Orgánico" },
            { ciudad: "Concepción", lat: -36.8201, lng: -73.0444, desc: "Distribuidora Regional del Biobío" },
            { ciudad: "Nacimiento", lat: -37.5028, lng: -72.6781, desc: "Sucursal y Productores Locales" },
            { ciudad: "Villarrica", lat: -39.2789, lng: -72.2272, desc: "Sucursal Zona Sur Verde" },
            { ciudad: "Puerto Montt", lat: -41.4693, lng: -72.9424, desc: "Sucursal Austral HuertoHogar" }
        ];

        // Inicializar el mapa
        const mapa = L.map(mapRef.current).setView([-36.5, -72.0], 5);
        mapInstance.current = mapa;

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors"
        }).addTo(mapa);

        // Añadir marcadores
        sucursales.forEach(s => {
            L.marker([s.lat, s.lng])
                .addTo(mapa)
                .bindPopup(`<b>HuertoHogar ${s.ciudad}</b><br>${s.desc}`);
        });

        // Cleanup al desmontar el componente
        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, []);

    return (
        <div 
            ref={mapRef} 
            style={{ 
                height: '400px', 
                borderRadius: '12px', 
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                width: '100%',
                position: 'relative',
                zIndex: 1
            }}
        />
    );
}
