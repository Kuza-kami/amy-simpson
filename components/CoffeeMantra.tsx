import React from 'react';
import { Coffee } from 'lucide-react';
import { motion } from 'framer-motion';

const CoffeeMantra: React.FC = () => {
  return (
    <section className="py-24 md:py-32 bg-design-blue border-t-2 border-b-2 border-design-black dark:border-white transition-colors duration-300 overflow-hidden relative">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(#000 2px, transparent 2px)',
          backgroundSize: '30px 30px'
      }}></div>

      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center relative z-10">
        
        {/* Animated Steaming Coffee Icon */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mb-12"
        >
            {/* Steam Particles */}
            <motion.div
                animate={{ y: [-4, -12, -20], opacity: [0, 0.6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                className="absolute -top-8 left-2 w-1.5 h-4 bg-design-black dark:bg-black rounded-full"
            />
            <motion.div
                animate={{ y: [-4, -16, -24], opacity: [0, 0.8, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", delay: 0.4 }}
                className="absolute -top-10 left-1/2 -translate-x-1/2 w-1.5 h-6 bg-design-black dark:bg-black rounded-full"
            />
            <motion.div
                animate={{ y: [-4, -12, -20], opacity: [0, 0.6, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 0.8 }}
                className="absolute -top-6 right-2 w-1.5 h-4 bg-design-black dark:bg-black rounded-full"
            />
            
            <div className="relative z-10 p-8 border-4 border-design-black dark:border-black bg-white dark:bg-white rounded-full shadow-flat dark:shadow-flat">
                <Coffee size={64} className="text-design-black dark:text-black" strokeWidth={2.5} />
            </div>
        </motion.div>

        {/* The Quote - Fixed visibility and sizing */}
        <motion.h2 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-bold uppercase leading-tight md:leading-[0.9] text-design-black dark:text-black tracking-tighter mb-12 px-4"
        >
            "Better <span className="text-outline-dark">Coffee</span> <br/>
            Than Not <span className="text-outline-dark">Coffee</span>"
        </motion.h2>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="inline-block bg-design-black dark:bg-black text-design-blue px-6 py-2 text-xs font-mono font-bold uppercase tracking-widest border-2 border-transparent"
        >
            Studio Fuel &bull; Est. 2025
        </motion.div>

      </div>
    </section>
  );
};

export default CoffeeMantra;