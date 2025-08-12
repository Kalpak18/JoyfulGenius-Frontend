import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const ScrollRestoration =() => {
  const { pathname } = useLocation();
  const positions = useRef({});

  useEffect(() => {
    // Restore scroll position if we have it saved
    if (positions.current[pathname] !== undefined) {
      window.scrollTo(0, positions.current[pathname]);
    } else {
      window.scrollTo(0, 0); // default: scroll to top
    }

    const handleScroll = () => {
      positions.current[pathname] = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  return null;
};

export default ScrollRestoration;
