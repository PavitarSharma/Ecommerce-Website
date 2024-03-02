

import { useState, useEffect } from "react";
interface Coordinates {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
}

const useGeolocation = (): Coordinates => {
  const [coordinates, setCoordinates] = useState<Coordinates>({
    latitude: null,
    longitude: null,
    error: null,
  });

  useEffect(() => {
    const geo = navigator.geolocation;

    if (!geo) {
      setCoordinates((prev) => ({
        ...prev,
        error: "Geolocation is not supported",
      }));
      return;
    }

    const watcher = geo.watchPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
      },
      (error) => {
        setCoordinates((prev) => ({
          ...prev,
          error: error.message,
        }));
      }
    );

    return () => geo.clearWatch(watcher);
  }, []);

  return coordinates;
};

export default useGeolocation;
