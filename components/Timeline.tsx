import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { timelineEvents } from '../data/content';

const Timeline: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  
  // Track scroll progress of the section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 75%", "end 75%"]
  });

  // Smooth spring physics for the line drawing
  const scaleY = useSpring(scrollYProgress, {
      stiffness: 60,
      damping: 20,
      restDelta: 0.001
  });

  return (
    <section ref={containerRef} id="timeline" className="py-24 md:py-32 bg-design-white dark:bg-[#0f0f0f] relative overflow-hidden transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 relative">
        
        {/* Header */}
        <div className="text-center mb-24 relative z-10">
             <span className="block text-xs font-mono uppercase tracking-widest mb-2 text-design-blue">The Process</span>
             <h2 className="text-4xl md:text-6xl font-display uppercase font-bold text-design-black dark:text-white">
                Career <br /><span className="italic font-serif font-light text-gray-400">Chronology</span>
             </h2>
        </div>

        {/* Animated Central Thread Line */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 md:-translate-x-1/2 pointer-events-none z-0">
             
             {/* Decorative Loop at top (Static Anchor) */}
             <div className="absolute top-32 left-1/2 -translate-x-1/2 -translate-y-full">
                 <svg width="60" height="80" viewBox="0 0 60 80" className="text-design-black dark:text-white stroke-current fill-none stroke-[2px] overflow-visible">
                     <path d="M 30,80 L 30,50 C 30,50 30,20 10,20 C -10,20 -10,50 30,50 C 70,50 70,20 50,20 C 30,20 30,50 30,50" />
                 </svg>
             </div>

             {/* The Drawing Line Container */}
             <div className="absolute top-32 bottom-0 left-1/2 -translate-x-[1px] w-[2px]">
                {/* Background Guide (Faint) */}
                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 w-full rounded-full opacity-30" />
                
                {/* Active Thread Line */}
                <motion.div 
                    className="absolute top-0 left-0 w-full bg-design-black dark:bg-white origin-top"
                    style={{ scaleY }}
                />

                {/* Needle Tip */}
                <motion.div
                    className="absolute left-1/2 -translate-x-1/2 w-6 h-12"
                    style={{ 
                        top: useTransform(scaleY, (v) => `${v * 100}%`),
                    }}
                >
                    {/* Needle Graphic */}
                    <div className="-translate-y-[85%] filter drop-shadow-md">
                        <svg width="24" height="48" viewBox="0 0 24 48" fill="none" className="text-design-black dark:text-white">
                            {/* Needle Body */}
                            <path d="M12 48L15 6C15.5 3 13.5 0 12 0C10.5 0 8.5 3 9 6L12 48Z" fill="currentColor"/>
                            {/* Eye of Needle (Hole) */}
                            <path d="M12 2L12 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" className="dark:stroke-black"/>
                        </svg>
                    </div>
                </motion.div>
             </div>
        </div>

        <div className="space-y-24 md:space-y-32 relative z-10">
           {timelineEvents.map((event, index) => {
               const isEven = index % 2 === 0;
               return (
                   <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 0.8 }}
                        key={index} 
                        className={`relative flex flex-col md:flex-row ${isEven ? 'md:flex-row-reverse' : ''} items-center`}
                   >
                        {/* Dot on line */}
                        <motion.div 
                            initial={{ scale: 0, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ margin: "-50% 0px -50% 0px" }} // Trigger when crossing center
                            transition={{ type: "spring" }}
                            className="absolute left-8 md:left-1/2 w-4 h-4 bg-design-white dark:bg-[#0f0f0f] border-2 border-design-black dark:border-white rounded-full md:-translate-x-1/2 z-10 transform -translate-x-[50%] mt-8 md:mt-0"
                        ></motion.div>

                        {/* Content Side */}
                        <div className={`w-full md:w-1/2 pl-20 md:pl-0 ${isEven ? 'md:pl-24 text-left' : 'md:pr-24 md:text-right'}`}>
                            <div className={`inline-block border border-design-black dark:border-white rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest bg-white dark:bg-black mb-4 shadow-sm ${!isEven && 'md:ml-auto'}`}>
                                {event.year}
                            </div>
                            <h3 className="text-2xl md:text-4xl font-display uppercase font-bold mb-3 text-design-black dark:text-white">{event.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 font-medium text-sm leading-relaxed max-w-sm mx-auto md:mx-0 ml-0 md:ml-auto">
                                {event.desc}
                            </p>
                        </div>

                        {/* Image Side */}
                        <div className={`w-full md:w-1/2 pl-20 md:pl-0 mt-8 md:mt-0 ${isEven ? 'md:pr-24' : 'md:pl-24'}`}>
                             <div className={`relative aspect-[16/10] w-full max-w-md mx-auto ${isEven ? 'mr-auto md:mr-0' : 'mr-auto'}`}>
                                 {/* Shadow Box */}
                                 <div className="absolute inset-0 bg-design-black dark:bg-white translate-x-3 translate-y-3 rounded-xl"></div>
                                 <img 
                                    src={event.image} 
                                    alt={event.title} 
                                    className="relative w-full h-full object-cover border-2 border-design-black dark:border-white rounded-xl grayscale hover:grayscale-0 transition-all duration-500 bg-gray-200"
                                 />
                             </div>
                        </div>
                   </motion.div>
               );
           })}
           
           {/* Final Knot/End */}
           <div className="relative flex justify-center pt-12 pl-8 md:pl-0">
               <div className="bg-design-white dark:bg-[#0f0f0f] border-2 border-design-black dark:border-white px-6 py-2 z-10 font-mono text-xs uppercase tracking-widest rounded-full shadow-flat dark:shadow-flat-white">
                   Present Day
               </div>
           </div>
        </div>

      </div>
    </section>
  );
};

export default Timeline;