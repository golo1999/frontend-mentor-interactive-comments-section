import { useCallback, useEffect, useState } from "react";

type DeviceType =
  | "DESKTOP"
  | "LAPTOP"
  | "MOBILE/LANDSCAPE"
  | "MOBILE/PORTRAIT"
  | "TABLET/LANDSCAPE"
  | "TABLET/PORTRAIT";

export function useDeviceType() {
  const [deviceType, setDeviceType] = useState<DeviceType>(getDeviceType());

  function getDeviceType(): DeviceType {
    if (window.innerWidth < 480) {
      return "MOBILE/PORTRAIT";
    } else if (window.innerWidth < 768) {
      return "MOBILE/LANDSCAPE";
    } else if (window.innerWidth < 992) {
      return "TABLET/PORTRAIT";
    } else if (window.innerWidth < 1200) {
      return "TABLET/LANDSCAPE";
    } else if (window.innerWidth < 1440) {
      return "LAPTOP";
    } else {
      return "DESKTOP";
    }
  }

  const handleResize = useCallback(() => {
    const newDeviceType = getDeviceType();

    if (newDeviceType !== deviceType) {
      setDeviceType(newDeviceType);
    }
  }, [deviceType]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  return deviceType;
}
