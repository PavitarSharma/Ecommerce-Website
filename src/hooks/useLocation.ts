import { useState, useEffect } from "react";

interface LocationData {
  latitude: number | null;
  longitude: number | null;
  ip: string | null;
  error: string | null;
}

const useLocation = (): LocationData => {
  const [locationData, setLocationData] = useState<LocationData>({
    latitude: null,
    longitude: null,
    ip: null,
    error: null,
  });

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        // Fetch user's IP address from an external service
        const ipResponse = await fetch("https://api64.ipify.org?format=json");
        const { ip } = await ipResponse.json();

        // Get user's geolocation using the browser's Geolocation API
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocationData({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              ip,
              error: null,
            });
          },
          (error) => {
            setLocationData((prev) => ({
              ...prev,
              error: error.message,
            }));
          }
        );
      } catch (error) {
        setLocationData((prev) => ({
          ...prev,
          error: "Failed to fetch location data",
        }));
      }
    };

    fetchLocationData();
  }, []);

  return locationData;
};

export default useLocation;
