import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  format?: (val: number) => string;
  duration?: number;
  className?: string;
}

export const AnimatedCounter = ({ 
  value, 
  format = (v) => Math.round(v).toString(), 
  duration = 0.5,
  className = ""
}: AnimatedCounterProps) => {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const controls = animate(displayValue, value, {
      duration,
      onUpdate(v) {
        node.textContent = format(v);
      },
      onComplete() {
        setDisplayValue(value);
      }
    });

    return () => controls.stop();
  }, [value, duration, format, displayValue]);

  return <span ref={nodeRef} className={className}>{format(displayValue)}</span>;
};
