"use client";

import type { LatLngExpression, LeafletEventHandlerFnMap } from "leaflet";
import { useCallback, useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON, type GeoJSONProps, Marker } from "react-leaflet";

import { ClickMarker } from "./ClickMarker";
import { recordingMarkerIcon, villageMarkerIcon } from "./icons";
import { LatLngGoto } from "./LatLngGoto";
import uttarakhandGeo from "@/assets/india_states.json";
import { useDashboardDispatch, useDashboardState } from "@/contexts/DashboardContext";
import type { LocationCompleteFragment } from "@/generated/graphql";
import { isDefined } from "@/utils/array";



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



export function Map() {
    const { fileTree, villages } = useDashboardState();
    const { selectLocation } = useDashboardDispatch();

    const locations = useMemo(() => (
        fileTree.getNodes()
            .map((node) => node.metadata?.location)
            .filter(isDefined)
            // Deduplicate on Location ID
            .filter((loc, idx, arr) => arr.findIndex((l) => l.id === loc.id) === idx)
    ),[fileTree]);

    const makeMarkerHandler = useCallback((loc: LocationCompleteFragment) => ({
        click: (ev) => {
            ev.originalEvent.stopPropagation();
            selectLocation(loc);
        }
    }) as LeafletEventHandlerFnMap, [selectLocation]);

    const villageMarkers = useMemo(() => (
        villages?.map((v) => (
            <Marker
                key={v.id}
                position={[v.location.latitude, v.location.longitude]}
                // eventHandlers={makeMarkerHandler(v)}
                icon={villageMarkerIcon}
            />
        ) ?? [])
    ), [villages]);
    const fileMarkers = useMemo(() => (
        locations?.filter((l) => !villages.some((v) => v.location.id === l.id)).map((l) => (
            <Marker
                key={l.id}
                position={[l.latitude, l.longitude]}
                eventHandlers={makeMarkerHandler(l)}
                icon={recordingMarkerIcon}
            />
        ) ?? [])
    ), [locations, makeMarkerHandler, villages]);



    return (
        <MapContainer center={UTTARAKHAND_CENTER} zoom={9} scrollWheelZoom={true} className="h-full">
            <TileLayer
                attribution={FreeTileLayers.ESRI.attribution}
                url={FreeTileLayers.ESRI.url}
            />
            <GeoJSON
                data={uttarakhandGeo as GeoJSONProps["data"]}
            />
            {villageMarkers}
            {fileMarkers}
            <ClickMarker/>
            <LatLngGoto className="absolute top-4 right-4 p-0 z-[1000] cursor-default"/>
        </MapContainer>
    );
}
