import React from 'react';
import { Mail, Instagram, Download, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { BlurReveal, RotatingWords, SplitText } from './TextAnimations';

const Services: React.FC = () => {
  const roles = [
    "Visual Artist",
    "Designer",
    "Environmental Designer",
    "Architecture",
    "Illustrator",
    "Fashion"
  ];

  return (
    <section id="about" className="py-24 bg-white dark:bg-[#0f0f0f] relative transition-colors duration-500 border-t border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-start mb-20">
            <BlurReveal>
                <span className="text-xs font-mono uppercase tracking-widest text-design-blue mb-4 block">About Me</span>
            </BlurReveal>
            
            <h2 className="text-5xl md:text-7xl font-display font-light text-design-black dark:text-white uppercase leading-none flex flex-col items-start">
               <SplitText text="Aspiring" className="block" />
               <div className="relative inline-block">
                 <SplitText text="Designer" className="font-bold relative z-10" delay={0.2} />
                 <motion.div 
                   initial={{ scaleX: 0 }}
                   whileInView={{ scaleX: 1 }}
                   viewport={{ once: true }}
                   transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                   className="absolute bottom-2 left-0 w-full h-4 bg-design-blue -z-10 origin-left opacity-50"
                 ></motion.div>
               </div>
            </h2>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
           
           {/* Left: Bio */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 1 }}
           >
              <BlurReveal delay={0.2}>
                <p className="text-2xl md:text-3xl leading-relaxed text-design-black dark:text-white font-light">
                    I believe in the tactility of design. From the texture of raw fabric to the stroke of a charcoal pencil, my work is grounded in material reality.
                </p>
                <p className="mt-8 text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                    My background in sewing and textile art allows me to construct garments that tell stories. I approach every project with a focus on structure, form, and the human experience.
                </p>
              </BlurReveal>
           </motion.div>

           {/* Right: Role, Downloads, Contact */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 1, delay: 0.2 }}
             className="flex flex-col space-y-12 lg:pl-12 border-l border-neutral-200 dark:border-neutral-800"
           >
              {/* Current Role */}
              <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-design-blue mb-2 block">Current Role</span>
                  <div className="font-bold font-display uppercase text-3xl h-10 text-design-black dark:text-white">
                       <RotatingWords words={roles} />
                  </div>
              </div>

              {/* Download Buttons */}
              <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-4 block">Resources</span>
                  <div className="flex flex-wrap gap-4">
                      <button className="flex items-center gap-3 px-6 py-3 bg-design-black dark:bg-white text-white dark:text-design-black rounded-full font-bold uppercase text-xs tracking-widest shadow-flat dark:shadow-flat-white hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                          <FileText size={16} />
                          <span>Download CV</span>
                      </button>
                      <button className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-[#1a1a1a] text-design-black dark:text-white border-2 border-design-black dark:border-white rounded-full font-bold uppercase text-xs tracking-widest shadow-flat dark:shadow-flat-white hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all group">
                          <Download size={16} className="group-hover:text-design-blue transition-colors" />
                          <span>Portfolio PDF</span>
                      </button>
                  </div>
              </div>

              {/* Contact */}
              <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-4 block">Connect</span>
                  <div className="space-y-4">
                      <a href="mailto:amy@example.com" className="flex items-center gap-4 group">
                          <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center group-hover:bg-design-blue group-hover:text-design-black transition-colors border border-transparent group-hover:border-design-black">
                              <Mail size={18} />
                          </div>
                          <span className="font-mono text-sm text-gray-600 dark:text-gray-400 group-hover:text-design-black dark:group-hover:text-white transition-colors">amy.simpson@design.com</span>
                      </a>

                      <a href="#" className="flex items-center gap-4 group">
                          <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center group-hover:bg-design-blue group-hover:text-design-black transition-colors border border-transparent group-hover:border-design-black">
                              <Instagram size={18} />
                          </div>
                          <span className="font-mono text-sm text-gray-600 dark:text-gray-400 group-hover:text-design-black dark:group-hover:text-white transition-colors">@amysimpson.design</span>
                      </a>
                  </div>
              </div>
           </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Services;