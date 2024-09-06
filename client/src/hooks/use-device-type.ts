import { useCallback, useEffect, useMemo, useState } from "react";

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

  const isLargeDevice = useMemo(
    () => deviceType === "LAPTOP" || deviceType === "DESKTOP",
    [deviceType]
  );
  const isMobileDevice = useMemo(
    () => deviceType === "MOBILE/PORTRAIT" || deviceType === "MOBILE/LANDSCAPE",
    [deviceType]
  );
  const isTabletDevice = useMemo(
    () => deviceType === "TABLET/PORTRAIT" || deviceType === "TABLET/LANDSCAPE",
    [deviceType]
  );
  const isSmallDevice = useMemo(
    () => isMobileDevice || isTabletDevice,
    [isMobileDevice, isTabletDevice]
  );

  return {
    deviceType,
    isLargeDevice,
    isMobileDevice,
    isSmallDevice,
    isTabletDevice,
  };
}
