import { Marker, useMapEvent } from "react-leaflet";

import { useDashboardDispatch, useDashboardState } from "@/app/context";



export function ClickMarker() {
    const { selectedLocation } = useDashboardState();
    const { setVirtualLocation } = useDashboardDispatch();

    useMapEvent("click", (ev) => {
        console.log("Click!");

        setVirtualLocation({
            latitude: ev.latlng.lat,
            longitude: ev.latlng.lng,
        });
    });

    return selectedLocation && !selectedLocation.id && <Marker
        position={[selectedLocation.latitude, selectedLocation.longitude]}
    />;
}
