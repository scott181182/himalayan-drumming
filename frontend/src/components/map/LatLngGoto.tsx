import { Button, Card, Input, Space } from "antd";
import { useCallback, useState } from "react";
import { useMap } from "react-leaflet";

import { useDashboardDispatch, useDashboardState } from "../DashboardContext";



export interface LatLngGotoProps {
    className?: string;
}

export function LatLngGoto({ className }: LatLngGotoProps) {
    const map = useMap();
    const { selectedLocation } = useDashboardState();
    const { setVirtualLocation } = useDashboardDispatch();

    const [latLngStr, setLatLngStr ] = useState<string | undefined>();
    const onGoto = useCallback(() => {
        if(latLngStr) {
            const latlng = latLngStr.split(/\s*,\s*/).map((l) => parseFloat(l)) as [number, number];
            map.setView(latlng);
            setVirtualLocation({
                latitude: latlng[0],
                longitude: latlng[1]
            });
        }
    }, [latLngStr, map, setVirtualLocation]);

    return (
        <Card className={className}>
            <Space direction="vertical">
                <Space>
                    Current Location:
                    {selectedLocation ? `(${selectedLocation.latitude}, ${selectedLocation.longitude})` : <em>none.</em>}
                </Space>
                <Space>
                    <Input size="small" value={latLngStr} onChange={(ev) => setLatLngStr(ev.target.value)}/>
                    <Button size="small" onClick={onGoto}>Go To</Button>
                </Space>
            </Space>
        </Card>
    );
}
