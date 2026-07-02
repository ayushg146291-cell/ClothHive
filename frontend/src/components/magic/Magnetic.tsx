import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface MagneticProps {
  children: React.ReactElement;
  padding?: number;
  disabled?: boolean;
}

export function Magnetic({ children, padding = 30, disabled = false }: MagneticProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled) return;
    
    const handleMouse = (e: MouseEvent) => {
      if (!ref.current) return;
      const { clientX, clientY } = e;
      const { height, width, left, top } = ref.current.getBoundingClientRect();
      const middleX = clientX - (left + width / 2);
      const middleY = clientY - (top + height / 2);

      if (
        clientX > left - padding &&
        clientX < left + width + padding &&
        clientY > top - padding &&
        clientY < top + height + padding
      ) {
        setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
      } else {
        setPosition({ x: 0, y: 0 });
      }
    };

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 });
    };

    window.addEventListener('mousemove', handleMouse);
    return () => {
      window.removeEventListener('mousemove', handleMouse);
    };
  }, [padding, disabled]);

  const { x, y } = position;

  return (
    <motion.div
      ref={ref}
      animate={{ x, y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      className="inline-block relative z-10"
    >
      {children}
    </motion.div>
  );
}
