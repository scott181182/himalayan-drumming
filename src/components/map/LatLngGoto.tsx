import { Button, Card, Input, Space } from "antd";
import L from "leaflet";
import Image from "next/image";
import type { MouseEventHandler } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMap } from "react-leaflet";

import { useDashboardDispatch, useDashboardState } from "../../contexts/DashboardContext";
import { formatLatLng } from "@/utils/location";

export interface LatLngGotoProps {
  className?: string;
}

function parseLatLngString(latLngStr: string): [number, number] | undefined {
  // TODO: more robust LatLng string parsing (e.g. w/ and w/out parens)
  const parts = latLngStr.split(/\s*,\s*/);
  if (parts.length !== 2) {
    return undefined;
  }

  const lat = parseFloat(parts[0]);
  const lng = parseFloat(parts[1]);

  if (isNaN(lat) || isNaN(lng)) {
    return undefined;
  }

  return [lat, lng];
}

// oxlint-disable-next-line max-lines-per-function
export function LatLngGoto({ className }: LatLngGotoProps) {
  const map = useMap();
  const { selectedLocation, selectedFiles, villages } = useDashboardState();
  const { setVirtualLocation } = useDashboardDispatch();

  const cardRef = useRef<HTMLDivElement>(null);
  const [latLngStr, setLatLngStr] = useState<string | undefined>();
  const onGoto = useCallback<MouseEventHandler>(() => {
    if (latLngStr) {
      const latlng = parseLatLngString(latLngStr);
      if (!latlng) {
        console.warn("Invalid LatLng string:", latLngStr);
        return;
      }
      map.setView(latlng);
      setVirtualLocation({
        latitude: latlng[0],
        longitude: latlng[1],
      });
    }
  }, [latLngStr, map, setVirtualLocation]);

  useEffect(() => {
    if (cardRef.current) {
      L.DomEvent.disableClickPropagation(cardRef.current);
    }
  }, []);

  const markerImage = useMemo(() => {
    if (selectedLocation?.id === "") {
      return <Image src="/assets/empty_marker.png" alt="empty marker" width={32} height={35} />;
    } else if (villages.some((v) => v.location.id === selectedLocation?.id)) {
      return <Image src="/assets/village_marker.png" alt="village marker" width={32} height={35} />;
    } else if (selectedFiles.length > 0) {
      return (
        <Image src="/assets/recording_marker.png" alt="village marker" width={32} height={35} />
      );
    }
    return <></>;
  }, [selectedLocation?.id, villages, selectedFiles.length]);

  return (
    <Card className={className} ref={cardRef} styles={{ body: { padding: "0.5rem" } }}>
      <Space orientation="vertical" align="center">
        <Space>
          <Input
            size="small"
            value={latLngStr}
            onChange={(ev) => {
              setLatLngStr(ev.target.value);
            }}
          />
          <Button size="small" onClick={onGoto}>
            Go To
          </Button>
        </Space>
        <div className="flex items-center gap-2">
          {markerImage}
          <span>
            {selectedLocation ? (
              `(${formatLatLng(selectedLocation.latitude, selectedLocation.longitude)})`
            ) : (
              <em>No Location Selected</em>
            )}
          </span>
        </div>
      </Space>
    </Card>
  );
}
