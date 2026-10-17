import { useEffect, useRef, useState } from "react";

/** Keep continuous experiments asleep outside the viewport and background tabs. */
export function useVisibleActivity<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  const [foreground, setForeground] = useState(!document.hidden);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    if (ref.current) observer.observe(ref.current);
    const onVisibility = () => setForeground(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);
  return { ref, active: visible && foreground };
}
