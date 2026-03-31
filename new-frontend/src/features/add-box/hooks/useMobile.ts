import { useEffect, useState } from "react";

export const useMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= breakpoint;
    }
    return false;
  });

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth <= breakpoint);
    checkIsMobile();
    
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, [breakpoint]);

  return isMobile;
};