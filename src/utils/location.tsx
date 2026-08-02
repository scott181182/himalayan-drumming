import type {
  LocationCompleteFragment,
  LatLngCreateNestedOneWithoutVillagesInput,
} from "@/generated/graphql";

export function selectedLocationToInput(
  location: Readonly<LocationCompleteFragment>,
): LatLngCreateNestedOneWithoutVillagesInput {
  return location.id
    ? {
        connect: { id: location.id },
      }
    : {
        create: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
      };
}

export function formatLatLng(lat: number, lng: number) {
  return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}
