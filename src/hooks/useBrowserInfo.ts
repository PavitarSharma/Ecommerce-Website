import { useEffect, useState } from "react";

const useBrowserInfo = () => {
  const [browserName, setBrowserName] = useState("Unknown");

  useEffect(() => {
    const detectBrowser = () => {
      const userAgent = navigator.userAgent;
      let name = "Unknown";

      if (userAgent.indexOf("Firefox") !== -1) {
        name = "Firefox";
      } else if (userAgent.indexOf("Chrome") !== -1) {
        name = "Chrome";
      } else if (userAgent.indexOf("Safari") !== -1) {
        name = "Safari";
      } else if (
        userAgent.indexOf("Opera") !== -1 ||
        userAgent.indexOf("OPR") !== -1
      ) {
        name = "Opera";
      } else if (userAgent.indexOf("Edge") !== -1) {
        name = "Edge";
      } else if (
        userAgent.indexOf("MSIE") !== -1 ||
        userAgent.indexOf("Trident/") !== -1
      ) {
        name = "Internet Explorer";
      }

      return name;
    };

    setBrowserName(detectBrowser());
  }, []);

  return browserName;
};

export default useBrowserInfo;
