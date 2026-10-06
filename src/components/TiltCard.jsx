import { useCallback, useRef, useState, useEffect } from "react";

/**
 * TiltCard – wraps any child element and applies a 3D perspective
 * tilt effect that follows the mouse cursor. Includes:
 *   - Dynamic shadow that shifts with tilt
 *   - Slight pop-out scale on hover
 *   - Smooth reset on mouse leave
 *   - Disabled on touch devices and prefers-reduced-motion
 */

function TiltCard({ children, className = "", maxTilt = 15, scale = 1.04 }) {
  const ref = useRef(null);
  const [enabled, setEnabled] = useState(true);

  // Check for reduced-motion preference and touch-only devices
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const touch = window.matchMedia("(hover: none)");
    const update = () => setEnabled(!mq.matches && !touch.matches);
    update();
    mq.addEventListener("change", update);
    touch.addEventListener("change", update);
    return () => {
      mq.removeEventListener("change", update);
      touch.removeEventListener("change", update);
    };
  }, []);

  const handleMove = useCallback(
    (e) => {
      if (!enabled || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width; // 0→1
      const y = (e.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * maxTilt * 2; // left-right tilt
      const rotateX = (0.5 - y) * maxTilt * 2; // up-down tilt
      const shadowX = (x - 0.5) * -20;
      const shadowY = (y - 0.5) * -20 + 20;

      ref.current.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale},${scale},${scale})`;
      ref.current.style.boxShadow = `${shadowX}px ${shadowY}px 30px rgba(0,0,0,0.25)`;
    },
    [enabled, maxTilt, scale]
  );

  const handleLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = "";
    ref.current.style.boxShadow = "";
  }, []);

  return (
    <div
      ref={ref}
      className={`tilt-card ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </div>
  );
}

export default TiltCard;
