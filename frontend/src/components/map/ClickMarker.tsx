"use client";

import { Marker, useMapEvent } from "react-leaflet";

import { emptyMarkerIcon } from "./icons";
import { useDashboardDispatch, useDashboardState } from "@/contexts/DashboardContext";



export function ClickMarker() {
    const { selectedLocation } = useDashboardState();
    const { setVirtualLocation } = useDashboardDispatch();

    useMapEvent("click", (ev) => {
        setVirtualLocation({
            latitude: ev.latlng.lat,
            longitude: ev.latlng.lng,
        });
    });

    return selectedLocation && !selectedLocation.id && <Marker
        position={[selectedLocation.latitude, selectedLocation.longitude]}
        icon={emptyMarkerIcon}
    />;
}
