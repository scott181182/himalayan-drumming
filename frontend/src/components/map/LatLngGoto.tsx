import { Button, Card, Input, Space } from "antd";
import L from "leaflet";
import type { MouseEventHandler} from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";

import { useDashboardDispatch, useDashboardState } from "../../contexts/DashboardContext";
import { formatLatLng } from "@/utils/location";



export interface LatLngGotoProps {
    className?: string;
}

export function LatLngGoto({ className }: LatLngGotoProps) {
    const map = useMap();
    const { selectedLocation } = useDashboardState();
    const { setVirtualLocation } = useDashboardDispatch();

    const cardRef = useRef<HTMLDivElement>(null);
    const [latLngStr, setLatLngStr ] = useState<string | undefined>();
    const onGoto = useCallback<MouseEventHandler>(() => {
        if(latLngStr) {
            const latlng = latLngStr.split(/\s*,\s*/).map((l) => parseFloat(l)) as [number, number];
            map.setView(latlng);
            setVirtualLocation({
                latitude: latlng[0],
                longitude: latlng[1]
            });
        }
    }, [latLngStr, map, setVirtualLocation]);

    useEffect(() => {
        if(cardRef.current) {
            L.DomEvent.disableClickPropagation(cardRef.current);
        }
    }, []);

    return (
        <Card className={className} ref={cardRef}>
            <Space direction="vertical">
                <Space>
                    Current Location:
                    {selectedLocation ? `(${formatLatLng(selectedLocation.latitude, selectedLocation.longitude)})` : <em>none.</em>}
                </Space>
                <Space>
                    <Input size="small" value={latLngStr} onChange={(ev) => setLatLngStr(ev.target.value)}/>
                    <Button size="small" onClick={onGoto}>Go To</Button>
                </Space>
            </Space>
        </Card>
    );
}
