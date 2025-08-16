import { useEffect, useState } from "react";
import { DEFAULT_CENTER } from "../constants";

export default function useGeoCenter(isOnline) {
  const [center, setCenter] = useState(DEFAULT_CENTER);

  useEffect(() => {
    if (!isOnline) return;
    const getLoc = () =>
      new Promise((ok) => {
        if (!navigator.geolocation) return ok(DEFAULT_CENTER);
        navigator.geolocation.getCurrentPosition(
          (p) => ok({ lat: p.coords.latitude, lng: p.coords.longitude }),
          () => ok(DEFAULT_CENTER),
          { timeout: 4000 }
        );
      });
    getLoc().then(setCenter);
  }, [isOnline]);

  return center;
}
