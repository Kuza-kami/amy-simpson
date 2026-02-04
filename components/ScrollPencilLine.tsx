import React, { useEffect, useState, useMemo } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

const ScrollPencilLine: React.FC = () => {
  const [docHeight, setDocHeight] = useState(0);
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 20, restDelta: 0.001 });
  
  const START_X = 40;
  const AMPLITUDE = 15;
  const FREQUENCY = 0.01;
  const STEP = 40;

  useEffect(() => {
    const measure = () => {
      setDocHeight(document.documentElement.scrollHeight);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  const pathD = useMemo(() => {
    if (docHeight === 0) return '';
    let d = `M ${START_X} 0`;
    for (let y = STEP; y <= docHeight + STEP; y += STEP) {
        const x = START_X + Math.sin(y * FREQUENCY) * AMPLITUDE;
        d += ` L ${x} ${y}`;
    }
    return d;
  }, [docHeight]);

  // Calculations for pencil tip position
  const currentY = useTransform(smoothProgress, [0, 1], [0, docHeight]);
  const currentX = useTransform(currentY, (y) => START_X + Math.sin(y * FREQUENCY) * AMPLITUDE);
  const rotation = useTransform(currentY, (y) => {
    const dxdy = AMPLITUDE * FREQUENCY * Math.cos(y * FREQUENCY);
    return Math.atan(dxdy) * (180 / Math.PI);
  });

  return (
    <div className="absolute top-0 left-0 w-full z-[1] pointer-events-none" style={{ height: docHeight }}>
       <svg className="absolute top-0 left-0 md:left-4 h-full w-[200px] overflow-visible">
          <path 
            d={pathD} 
            stroke="currentColor" 
            strokeWidth="1" 
            fill="none" 
            className="text-gray-300 dark:text-neutral-800 opacity-20" 
            strokeDasharray="4 8" 
          />
          <motion.path 
            d={pathD} 
            stroke="currentColor" 
            strokeWidth="2.5" 
            fill="none" 
            className="text-design-blue dark:text-white"
            style={{ pathLength: smoothProgress }}
          />
       </svg>

       {/* Fix: Replace non-standard xPercent/yPercent with standard translateX/translateY strings to align with MotionStyle type definitions */}
       <motion.div 
          className="absolute top-0 left-0 md:left-4 text-design-black dark:text-white z-40"
          style={{ x: currentX, y: currentY, rotate: rotation, translateX: '-50%', translateY: '-100%' }}
       >
           <div className="filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.2)]">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M12.8787 3.12132C13.4413 2.55871 14.3536 2.55871 14.9162 3.12132L20.8787 9.08388C21.4413 9.6465 21.4413 10.5587 20.8787 11.1213L10.3787 21.6213C10.1125 21.8875 9.76182 22.0468 9.38729 22.0722L4.38729 22.4111C3.82424 22.4493 3.35073 21.9758 3.3889 21.4127L3.72777 16.4127C3.75316 16.0382 3.91249 15.6875 4.17868 15.4213L12.8787 3.12132ZM5.57813 16.7915L5.32398 20.5414L9.07393 20.2872L18.7574 10.6038L15.2624 7.10878L5.57813 16.7915Z" />
             </svg>
           </div>
       </motion.div>
    </div>
  );
};

export default ScrollPencilLine;