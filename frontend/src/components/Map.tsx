"use client";

import type { LatLngExpression } from "leaflet";
import { MapContainer, TileLayer, GeoJSON, type GeoJSONProps } from "react-leaflet";

import uttarakhandGeo from "@/assets/uttarakhand.json";



const UTTARAKHAND_CENTER: LatLngExpression = [30.407022, 78.956246];

const FreeTileLayers = {
    ESRI: {
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    },
    TOPO: {
        url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
        attribution: "Map data: &copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors, <a href=\"http://viewfinderpanoramas.org\">SRTM</a> | Map style: &copy; <a href=\"https://opentopomap.org\">OpenTopoMap</a> (<a href=\"https://creativecommons.org/licenses/by-sa/3.0/\">CC-BY-SA</a>)",
    },
    StamenTerrain: {
        url: "https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png",
        attribution: "Map tiles by <a href=\"http://stamen.com\">Stamen Design</a>, <a href=\"http://creativecommons.org/licenses/by/3.0\">CC BY 3.0</a> &mdash; Map data &copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors"
    }
};



export interface MapProps {
    height: number;
}

export function Map() {


    return (
        <MapContainer center={UTTARAKHAND_CENTER} zoom={9} scrollWheelZoom={false} className="h-full">
            <TileLayer
                attribution={FreeTileLayers.StamenTerrain.attribution}
                url={FreeTileLayers.StamenTerrain.url}
            />
            <GeoJSON
                data={uttarakhandGeo as GeoJSONProps["data"]}
            />
        </MapContainer>
    );
}
