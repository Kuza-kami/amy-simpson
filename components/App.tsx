import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import Services from './Services';
import Timeline from './Timeline';
import Testimonials from './Testimonials';
import Portfolio from './Portfolio';
import ScrollPencilLine from './ScrollPencilLine';
import CoffeeMantra from './CoffeeMantra';
import { motion, useSpring } from 'framer-motion';

const CustomCursor = () => {
  const mouseX = useSpring(0, { stiffness: 1000, damping: 50 });
  const mouseY = useSpring(0, { stiffness: 1000, damping: 50 });
  const ringX = useSpring(0, { stiffness: 400, damping: 40 });
  const ringY = useSpring(0, { stiffness: 400, damping: 40 });
  
  const [isHovering, setIsHovering] = React.useState(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      ringX.set(e.clientX);
      ringY.set(e.clientY);
      
      const target = e.target as HTMLElement;
      const isClickable = target.closest('a, button, input, textarea, .cursor-pointer');
      setIsHovering(!!isClickable);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [mouseX, mouseY, ringX, ringY]);

  return (
    <div className="hidden md:block pointer-events-none fixed inset-0 z-[9999]">
      <motion.div 
        className="fixed top-0 left-0 w-2 h-2 bg-design-blue rounded-full mix-blend-difference"
        style={{ x: mouseX, y: mouseY, translateX: '-50%', translateY: '-50%' }}
      />
      <motion.div 
        className="fixed top-0 left-0 rounded-full border border-design-black dark:border-white opacity-40"
        animate={{ 
          scale: isHovering ? 2 : 1,
          borderWidth: isHovering ? 1 : 2,
          backgroundColor: isHovering ? 'rgba(162, 210, 255, 0.2)' : 'transparent'
        }}
        style={{ 
          x: ringX, y: ringY, width: 32, height: 32, 
          translateX: '-50%', translateY: '-50%',
        }}
      />
    </div>
  );
};

const RevealSection: React.FC<{ children: React.ReactNode; id?: string; className?: string }> = ({ children, id, className = "" }) => {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-design-cream dark:bg-[#0a0a0a] text-design-black dark:text-white font-sans selection:bg-design-blue selection:text-design-black transition-colors duration-300 relative overflow-x-hidden">
      <div className="bg-noise pointer-events-none opacity-[0.03] dark:opacity-[0.05]"></div>
      
      <CustomCursor />
      <ScrollPencilLine />
      <Navbar />
      
      <main className="relative">
        <Hero />
        
        <RevealSection id="about" className="scroll-mt-20">
          <Services />
        </RevealSection>

        <RevealSection id="timeline" className="scroll-mt-20">
          <Timeline />
        </RevealSection>

        <RevealSection id="portfolio" className="scroll-mt-20">
          <Portfolio />
        </RevealSection>

        <RevealSection id="testimonials" className="scroll-mt-20">
          <Testimonials />
        </RevealSection>

        <RevealSection>
          <CoffeeMantra />
        </RevealSection>
      </main>
      
      <footer className="bg-design-black py-24 border-t-4 border-design-blue text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
            backgroundSize: '32px 32px'
        }}></div>
        <div className="relative z-10 max-w-4xl mx-auto px-6">
            <h2 className="text-7xl font-display font-bold mb-8 tracking-tighter uppercase text-white">Simpson</h2>
            <div className="flex justify-center flex-wrap gap-8 md:gap-12 mb-16">
               {['Dribbble', 'Behance', 'LinkedIn', 'Instagram'].map(s => (
                  <a key={s} href="#" className="text-xs font-bold uppercase tracking-widest hover:text-design-blue transition-all relative group text-white">
                    {s}
                  </a>
               ))}
            </div>
            <p className="text-gray-600 text-[10px] font-mono uppercase tracking-[0.3em]">
              © {new Date().getFullYear()} Simpson Studio &bull; Built with Strength and Precision
            </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
