"use client";

import type { LatLngExpression, LeafletEventHandlerFnMap } from "leaflet";
import { useCallback, useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON, type GeoJSONProps, Marker } from "react-leaflet";

import { ClickMarker } from "./ClickMarker";
import { useDashboardDispatch, useDashboardState } from "@/app/context";
import uttarakhandGeo from "@/assets/india_states.json";
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
    const { fileTree } = useDashboardState();
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

    const markers = useMemo(() => (
        locations?.map((l) => (
            <Marker
                key={l.id}
                position={[l.latitude, l.longitude]}
                eventHandlers={makeMarkerHandler(l)}
            />
        ) ?? [])
    ), [locations, makeMarkerHandler]);




    return (
        <MapContainer center={UTTARAKHAND_CENTER} zoom={9} scrollWheelZoom={false} className="h-full">
            <TileLayer
                attribution={FreeTileLayers.StamenTerrain.attribution}
                url={FreeTileLayers.StamenTerrain.url}
            />
            <GeoJSON
                data={uttarakhandGeo as GeoJSONProps["data"]}
            />
            {markers}
            <ClickMarker/>
        </MapContainer>
    );
}
