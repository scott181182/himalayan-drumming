import { Marker, useMapEvent } from "react-leaflet";

import { useDashboardDispatch, useDashboardState } from "@/app/context";



export function ClickMarker() {
    const { selectedLocation } = useDashboardState();
    const dispatch = useDashboardDispatch();

    useMapEvent("click", (ev) => {
        console.log("Click!");

        dispatch({
            type: "setVirtualLocation",
            payload: {
                latitude: ev.latlng.lat,
                longitude: ev.latlng.lng,
            }
        });
    });

    return selectedLocation && !selectedLocation.id && <Marker
        position={[selectedLocation.latitude, selectedLocation.longitude]}
    />;
}
