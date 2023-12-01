import { Button, Card, Input, Space } from "antd";
import L from "leaflet";
import Image from "next/image";
import type { MouseEventHandler} from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMap } from "react-leaflet";

import { useDashboardDispatch, useDashboardState } from "../../contexts/DashboardContext";
import { formatLatLng } from "@/utils/location";



export interface LatLngGotoProps {
    className?: string;
}

export function LatLngGoto({ className }: LatLngGotoProps) {
    const map = useMap();
    const { selectedLocation, selectedFiles, selectedVillage } = useDashboardState();
    const { setVirtualLocation } = useDashboardDispatch();

    const cardRef = useRef<HTMLDivElement>(null);
    const [latLngStr, setLatLngStr ] = useState<string | undefined>();
    const onGoto = useCallback<MouseEventHandler>(() => {
        if(latLngStr) {
            // TODO: more robust LatLng string parsing (e.g. w/ and w/out parens)
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

    const markerImage = useMemo(() => {
        if(selectedLocation?.id === "") {
            return <Image src="/assets/empty_marker.png" alt="empty marker" width={32} height={35}/>;
        } else if(selectedVillage) {
            return <Image src="/assets/village_marker.png" alt="village marker" width={32} height={35}/>;
        } else if(selectedFiles.length > 0) {
            return <Image src="/assets/recording_marker.png" alt="village marker" width={32} height={35}/>;
        } else {
            return <></>;
        }
    }, [selectedFiles.length, selectedLocation, selectedVillage]);

    return (
        <Card className={className} ref={cardRef} bodyStyle={{ padding: "0.5rem" }}>
            <Space direction="vertical" align="center">
                <Space>
                    <Input size="small" value={latLngStr} onChange={(ev) => setLatLngStr(ev.target.value)}/>
                    <Button size="small" onClick={onGoto}>Go To</Button>
                </Space>
                <div className="flex items-center gap-2">
                    {markerImage}
                    <span>
                        {selectedLocation ? `(${formatLatLng(selectedLocation.latitude, selectedLocation.longitude)})` : <em>No Location Selected</em>}
                    </span>
                </div>
            </Space>
        </Card>
    );
}
