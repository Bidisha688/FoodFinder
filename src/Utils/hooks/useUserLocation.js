// src/hooks/useUserLocation.js
import { useEffect, useState } from "react";

const DEFAULT_CENTER = { lat: 20.1541, lng: 85.7087 };

export default function useUserLocation() {
  const [location, setLocation] = useState(DEFAULT_CENTER);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (p) => setLocation({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => setLocation(DEFAULT_CENTER),
      { timeout: 3000 }
    );
  }, []);

  return location;
}
