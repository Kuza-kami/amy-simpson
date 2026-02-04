import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Project } from '../types';
import { ArrowUpRight, X, Share2, Ruler, Lightbulb, Download, Layers, Activity, Fingerprint, Scissors, Palette } from 'lucide-react';
import Comments from './Comments';
import { motion, AnimatePresence, useScroll, useSpring, useTransform, MotionValue } from 'framer-motion';
import { portfolioProjects } from '../data/content';

const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  e.currentTarget.onerror = null;
  e.currentTarget.src = "https://placehold.co/800x600/1a1a1a/666666?text=Asset+Unavailable&font=oswald";
};

const moreProjects: Project[] = Array.from({ length: 12 }, (_, i) => {
  const categories = ["Garment", "Textile", "Sketches", "Illustration"];
  const category = categories[i % categories.length];
  // Start IDs from 21 since portfolioProjects now has 20 items (IDs 1-20)
  const id = i + 21;
  const height = [600, 800, 1000, 1200][i % 4];
  const year = (2020 + (i % 5)).toString();
  
  return {
    id: id,
    title: `Concept ${id}`,
    category: category,
    image: `https://picsum.photos/seed/${id + 500}/800/${height}`,
    description: `Experimental concept focusing on ${category.toLowerCase()} principles and form.`,
    year: year
  };
});

const getProjectDetails = (project: Project) => {
    const measurements = ["42x59 cm", "Custom Fit", "300x360 cm", "1920x1080", "180x90 cm"];
    const concepts = ["Minimalist", "Deconstruct", "Organic", "Geometric", "Fluidity"];
    const mediaTypes = ["Graphite / Ink", "Tech Silk / Nylon", "Vector / Digital", "Charcoal / Paper", "3D Render / CLO"];
    const index = project.title.length % 5;

    return {
        measurement: measurements[index],
        concept: concepts[index],
        media: mediaTypes[index]
    };
};

// Helper to get high res image url
const getHighResUrl = (url: string) => {
  if (url.includes('unsplash.com')) {
    return url.replace(/w=\d+/, 'w=2400').replace(/q=\d+/, 'q=100');
  }
  if (url.includes('picsum.photos')) {
     // Regex to match width/height at the end of the url and replace with HD dimensions
     return url.replace(/\/\d+\/\d+$/, '/1920/1280');
  }
  return url;
};

const ProcessStep: React.FC<{
  step: { title: string; icon: React.ReactNode; desc: string };
  index: number;
  scrollYProgress: MotionValue<number>;
  projectId: number;
  onImageClick: (src: string) => void;
}> = ({ step, index, scrollYProgress, projectId, onImageClick }) => {
  // Calculate active range for this step
  // We have 4 steps spread over the scroll height (approx 0-1)
  const stepSector = 1 / 4;
  const start = index * stepSector;
  const triggerPoint = start + (stepSector * 0.4); // Trigger when line enters the section

  // Transform scroll progress to animation states
  const isActive = useTransform(scrollYProgress, [triggerPoint, triggerPoint + 0.1], [0, 1]);
  
  const opacity = useTransform(isActive, [0, 1], [0.3, 1]);
  const grayscale = useTransform(isActive, [0, 1], [1, 0]); // 1 = 100% grayscale
  const scale = useTransform(isActive, [0, 1], [1, 1.05]);
  const borderColor = useTransform(isActive, [0, 1], ["rgba(255,255,255,0.1)", "rgba(162, 210, 255, 0.8)"]);
  const shadowOpacity = useTransform(isActive, [0, 1], [0, 0.3]);
  const borderWidth = useTransform(isActive, [0, 1], [1, 2]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ margin: "-100px" }}
      className={`flex flex-col md:flex-row items-center gap-8 md:gap-12 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
    >
      <div className="w-full md:w-1/2 text-center md:text-left relative z-10">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-design-blue text-black rounded-full mb-6 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
          {step.icon}
        </div>
        <h4 className="text-3xl md:text-4xl font-display font-bold uppercase mb-4 tracking-tight">{step.title}</h4>
        <p className="text-gray-400 font-light leading-relaxed max-w-sm mx-auto md:mx-0 text-sm md:text-base">
          {step.desc}
        </p>
      </div>
      
      <motion.button 
        style={{ 
          opacity, 
          scale, 
          borderColor,
          borderWidth,
          boxShadow: useTransform(shadowOpacity, v => `0 20px 40px -10px rgba(162, 210, 255, ${v})`)
        }}
        onClick={() => onImageClick(`https://picsum.photos/seed/step-${index}-${projectId}/1600/900`)}
        className="w-full md:w-1/2 aspect-video bg-neutral-900 rounded-[2rem] overflow-hidden border border-white/10 group relative z-20 cursor-zoom-in outline-none focus:ring-2 focus:ring-design-blue"
        aria-label={`View high resolution process image for ${step.title}`}
      >
          <motion.img 
            style={{ filter: useTransform(grayscale, v => `grayscale(${v})`) }}
            src={`https://picsum.photos/seed/step-${index}-${projectId}/800/450`} 
            alt={step.title} 
            className="w-full h-full object-cover transition-all duration-700"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
             <span className="font-mono text-[10px] uppercase tracking-widest text-white/50">PHASE_0{index + 1}</span>
          </div>
          
          {/* Active Highlight Overlay */}
          <motion.div 
             style={{ opacity: isActive }}
             className="absolute inset-0 bg-design-blue/10 pointer-events-none mix-blend-overlay"
          />
      </motion.button>
    </motion.div>
  );
};

const DeconstructionView: React.FC<{ onClose: () => void; project: Project }> = ({ onClose, project }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: scrollRef });
  const pathLength = useSpring(scrollYProgress, { stiffness: 400, damping: 90 });
  const [fullScreenImg, setFullScreenImg] = useState<string | null>(null);

  const steps = [
    { title: "Simpson Sketch", icon: <Scissors size={20} />, desc: "Initial translation of gymnastic floor routine movements into 2D structural planes." },
    { title: "Material Tension", icon: <Layers size={20} />, desc: "Selecting high-performance technical fabrics that maintain form under extreme physical stress." },
    { title: "S-Curve Draping", icon: <Fingerprint size={20} />, desc: "Adjusting the grainline to follow the natural torque of a twisting torso." },
    { title: "Final Landing", icon: <Activity size={20} />, desc: "The intersection of aesthetic perfection and unhindered athletic mobility." }
  ];

  return (
    <>
    <motion.div 
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute inset-0 z-[110] bg-design-black text-white flex flex-col overflow-hidden"
    >
      <div className="p-6 md:p-8 flex justify-between items-center border-b border-white/10 shrink-0 bg-design-black z-30">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-design-blue mb-1 block">Analytical View</span>
          <h3 className="text-xl md:text-3xl font-display font-bold uppercase tracking-tighter">Process Deconstruction</h3>
        </div>
        <button 
          onClick={onClose}
          className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border border-white/20 hover:bg-white hover:text-black transition-all"
        >
          <X size={20} />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-20 relative">
        <div className="max-w-5xl mx-auto relative">
          
          {/* The Snake/S-Curve Path */}
          <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-[600px] pointer-events-none hidden md:block z-0">
            <svg viewBox="0 0 100 800" preserveAspectRatio="none" className="w-full h-full fill-none overflow-visible">
              <defs>
                 <linearGradient id="snakeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#A2D2FF" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#A2D2FF" stopOpacity="1" />
                 </linearGradient>
              </defs>
              
              <path 
                d="M 50,0 Q 150,100 50,200 Q -50,300 50,400 Q 150,500 50,600 Q -50,700 50,800" 
                stroke="white" 
                strokeWidth="1" 
                strokeDasharray="4 4" 
                className="opacity-10"
              />
              <motion.path 
                d="M 50,0 Q 150,100 50,200 Q -50,300 50,400 Q 150,500 50,600 Q -50,700 50,800" 
                stroke="#A2D2FF" 
                strokeWidth="3" 
                strokeLinecap="round" 
                fill="none" 
                style={{ pathLength }}
              />
            </svg>
          </div>

          <div className="space-y-32 md:space-y-64 relative z-10 pb-40">
            {steps.map((step, idx) => (
               <ProcessStep 
                  key={idx} 
                  step={step} 
                  index={idx} 
                  scrollYProgress={scrollYProgress} 
                  projectId={project.id} 
                  onImageClick={setFullScreenImg}
               />
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-6 md:p-8 border-t border-white/10 shrink-0 text-center bg-design-black z-30">
        <p className="font-mono text-[9px] uppercase tracking-[0.5em] text-gray-500">
          Simpson Structural Analysis &copy; 2025
        </p>
      </div>
    </motion.div>

    <AnimatePresence>
      {fullScreenImg && (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
            onClick={() => setFullScreenImg(null)}
        >
             <button 
                onClick={() => setFullScreenImg(null)}
                className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all z-50 focus:outline-none focus:ring-2 focus:ring-white"
             >
                <X size={24} />
             </button>

             <motion.img
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                src={fullScreenImg}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()} 
                onError={handleImageError}
             />
             
             <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-xs font-mono uppercase tracking-widest pointer-events-none">
                High Resolution Analysis
             </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
};

const Portfolio: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDeconstructing, setIsDeconstructing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewHighRes, setViewHighRes] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = selectedProject || viewHighRes ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedProject, viewHighRes]);

  // Handle Escape key to close modals
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (viewHighRes) setViewHighRes(null);
        else if (isDeconstructing) setIsDeconstructing(false);
        else if (selectedProject) setSelectedProject(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [selectedProject, isDeconstructing, viewHighRes]);

  const allProjects = useMemo(() => {
    return showAll ? [...portfolioProjects, ...moreProjects] : portfolioProjects;
  }, [showAll]);

  const filteredProjects = useMemo(() => {
    return activeFilter === 'All' 
      ? allProjects 
      : allProjects.filter(p => p.category === activeFilter);
  }, [activeFilter, allProjects]);

  const handleLoadMore = () => {
    setLoading(true);
    setTimeout(() => {
        setShowAll(true);
        setLoading(false);
    }, 400); 
  };

  const details = useMemo(() => 
    selectedProject ? getProjectDetails(selectedProject) : { measurement: '', concept: '', media: '' },
    [selectedProject]
  );

  return (
    <section id="portfolio" className="py-20 md:py-32 bg-[#050505] relative text-white">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 relative">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 px-2 border-b border-white/10 pb-12">
          <div>
             <span className="block text-xs font-mono uppercase tracking-widest mb-4 text-design-blue">The Archive</span>
             <h2 className="text-6xl md:text-7xl lg:text-9xl font-display font-medium text-white uppercase tracking-tighter leading-[0.75]">
                SIMPSON <br/><span className="italic font-serif font-light opacity-30">Archive</span>
             </h2>
          </div>
          <div className="flex flex-wrap gap-3 mb-2">
             {['All', 'Garment', 'Textile', 'Sketches', 'Illustration'].map((filter) => (
                <button 
                  key={filter} 
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 sm:px-8 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all rounded-full border-2 ${activeFilter === filter ? 'bg-design-blue text-black border-design-blue' : 'bg-transparent border-white/20 text-gray-500 hover:border-white hover:text-white'} focus:outline-none focus:ring-2 focus:ring-design-blue`}
                >
                   {filter}
                </button>
             ))}
          </div>
        </div>

        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-6 w-full mx-auto px-2">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div 
                layout
                key={project.id}
                onClick={() => setSelectedProject(project)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedProject(project);
                  }
                }}
                role="button"
                tabIndex={0}
                className="break-inside-avoid mb-6 group cursor-zoom-in relative focus:outline-none"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                transition={{ 
                  type: "spring",
                  stiffness: 350,
                  damping: 25,
                  mass: 1
                }}
              >
                <div className="relative rounded-[2rem] overflow-hidden bg-[#111] border border-white/5 group-focus:ring-2 group-focus:ring-design-blue" style={{ aspectRatio: 'auto' }}>
                    <img 
                        src={project.image} 
                        alt={project.title} 
                        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform"
                        loading="lazy"
                        onError={handleImageError}
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    <div className="absolute inset-0 p-6 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex justify-end">
                            <span className="bg-design-blue text-black px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-white transition-all transform -translate-y-2 group-hover:translate-y-0">
                                Examine
                            </span>
                        </div>
                        <div className="flex justify-between items-center transform translate-y-2 group-hover:translate-y-0">
                             <div className="w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full text-white border border-white/20">
                                 <ArrowUpRight size={18} />
                             </div>
                             <div className="w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full text-white border border-white/20">
                                 <Share2 size={16} />
                             </div>
                        </div>
                    </div>
                </div>
                <div className="mt-4 px-2">
                   <h3 className="text-base font-bold text-white mb-1 uppercase tracking-tight">{project.title}</h3>
                   <div className="flex items-center justify-between opacity-50">
                      <p className="text-[10px] font-mono uppercase tracking-widest">{project.category}</p>
                      <span className="text-[10px] font-mono">{project.year}</span>
                   </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {!showAll && (
            <div className="mt-32 flex justify-center">
                <button 
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="group relative px-12 py-5 bg-transparent border-2 border-white/20 overflow-hidden rounded-full transition-all hover:border-white focus:outline-none focus:ring-2 focus:ring-design-blue"
                >
                    <span className="relative z-10 text-xs font-bold uppercase tracking-widest text-white group-hover:text-black transition-colors">
                        {loading ? "Warming Up..." : "Load Complete Archive"}
                    </span>
                    <div className="absolute inset-0 bg-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                </button>
            </div>
        )}
      </div>

      <AnimatePresence>
      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/80 backdrop-blur-xl" 
            onClick={() => {
              setSelectedProject(null);
              setIsDeconstructing(false);
            }}
          />
          
          <motion.div 
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className="relative bg-white w-full max-w-[1700px] h-full md:h-[90vh] shadow-2xl flex flex-col overflow-hidden md:rounded-[3rem] border border-neutral-200 text-design-black"
          >
            <AnimatePresence>
              {isDeconstructing && (
                <DeconstructionView 
                  project={selectedProject} 
                  onClose={() => setIsDeconstructing(false)} 
                />
              )}
            </AnimatePresence>

            <button 
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 md:top-8 md:right-8 z-50 w-10 h-10 md:w-14 md:h-14 flex items-center justify-center bg-design-black text-white rounded-full hover:rotate-90 transition-transform duration-500 shadow-xl focus:outline-none focus:ring-2 focus:ring-design-blue"
            >
              <X size={20} className="md:w-6 md:h-6" />
            </button>

            <div className="flex flex-col lg:flex-row h-full">
              <div className="w-full lg:w-3/5 h-[40vh] lg:h-full bg-neutral-100 relative group overflow-hidden flex items-center justify-center p-6 md:p-8 lg:p-24 border-b lg:border-b-0 lg:border-r border-neutral-200">
                  {/* Grid Background for technical feel */}
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                       style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                  </div>

                  <div className="relative w-full h-full flex items-center justify-center">
                      <motion.img 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          src={selectedProject.image} 
                          alt={selectedProject.title} 
                          onClick={(e) => {
                             e.stopPropagation();
                             setViewHighRes(getHighResUrl(selectedProject.image));
                          }}
                          className="relative z-10 max-w-full max-h-full md:max-w-[60%] md:max-h-[60%] object-contain shadow-2xl rounded-2xl border border-white/10 cursor-zoom-in hover:scale-[1.02] transition-transform duration-300" 
                          onError={handleImageError}
                      />

                      {/* Horizontal Dimension Line (Width) */}
                      <motion.div 
                          initial={{ opacity: 0, width: "0%" }}
                          animate={{ opacity: 1, width: "90%" }}
                          transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                          className="absolute bottom-4 lg:bottom-10 left-1/2 -translate-x-1/2 h-10 flex flex-col items-center justify-end z-20 pointer-events-none hidden md:flex"
                      >
                          <div className="bg-white text-design-black border border-neutral-200 px-3 py-1 mb-2 shadow-sm rounded-sm">
                             <span className="text-[10px] font-mono font-bold uppercase tracking-widest">
                                Width: {details.measurement.split('x')[0]}
                             </span>
                          </div>
                          <div className="w-full flex items-end relative">
                             <div className="w-px h-3 bg-design-black/50"></div>
                             <div className="w-full h-px bg-design-black/50"></div>
                             <div className="w-px h-3 bg-design-black/50"></div>
                          </div>
                      </motion.div>

                      {/* Vertical Dimension Line (Height) */}
                      <motion.div 
                          initial={{ opacity: 0, height: "0%" }}
                          animate={{ opacity: 1, height: "80%" }}
                          transition={{ delay: 0.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                          className="absolute right-4 lg:right-10 top-1/2 -translate-y-1/2 w-10 flex flex-row items-center justify-end z-20 pointer-events-none hidden md:flex"
                      >
                          <div className="h-full flex flex-col items-end relative">
                             <div className="w-3 h-px bg-design-black/50"></div>
                             <div className="h-full w-px bg-design-black/50"></div>
                             <div className="w-3 h-px bg-design-black/50"></div>
                          </div>
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 -rotate-90 bg-white text-design-black border border-neutral-200 px-3 py-1 shadow-sm rounded-sm whitespace-nowrap">
                             <span className="text-[10px] font-mono font-bold uppercase tracking-widest">
                                Height: {details.measurement.split('x')[1] || 'Auto'}
                             </span>
                          </div>
                      </motion.div>
                  </div>
              </div>

              <div className="w-full lg:w-2/5 h-auto lg:h-full bg-white p-6 md:p-8 lg:p-20 flex flex-col overflow-y-auto">
                  <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                  >
                      <div className="flex items-center gap-4 mb-6 md:mb-8">
                          <span className="px-4 py-1.5 bg-design-blue text-black text-[10px] font-bold uppercase tracking-widest rounded-full">{selectedProject.category}</span>
                          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Edition {selectedProject.year}</span>
                      </div>

                      <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-display font-medium text-design-black leading-none mb-6 md:mb-8 uppercase tracking-tighter">
                          {selectedProject.title}
                      </h2>
                      
                      <p className="text-gray-600 leading-relaxed font-light text-base md:text-lg mb-8">
                          {selectedProject.description}
                      </p>

                      <div className="flex flex-wrap gap-4 mb-12">
                        {selectedProject.downloadUrl && (
                          <a 
                            href={selectedProject.downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-6 py-3 bg-design-black text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:opacity-80 transition-all focus:outline-none focus:ring-2 focus:ring-design-blue"
                          >
                            <Download size={14} />
                            Download Assets
                          </a>
                        )}
                        <button 
                          onClick={() => setIsDeconstructing(true)}
                          className="inline-flex items-center gap-3 px-6 py-3 bg-design-blue text-black rounded-full text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-flat focus:outline-none focus:ring-2 focus:ring-black"
                        >
                          <Activity size={14} />
                          View Process
                        </button>
                      </div>
                  </motion.div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-12">
                          <div className="p-4 border border-neutral-100 rounded-3xl flex flex-col items-center justify-center text-center">
                              <Ruler className="mb-3 text-design-blue" size={24} />
                              <span className="text-[10px] font-mono uppercase text-gray-400 mb-1">Scale</span>
                              <span className="font-bold text-xs md:text-sm uppercase text-design-black">{details.measurement}</span>
                          </div>
                          <div className="p-4 border border-neutral-100 rounded-3xl flex flex-col items-center justify-center text-center">
                              <Lightbulb className="mb-3 text-design-blue" size={24} />
                              <span className="text-[10px] font-mono uppercase text-gray-400 mb-1">Logic</span>
                              <span className="font-bold text-xs md:text-sm uppercase text-design-black">{details.concept}</span>
                          </div>
                          <div className="p-4 border border-neutral-100 rounded-3xl flex flex-col items-center justify-center text-center">
                              <Palette className="mb-3 text-design-blue" size={24} />
                              <span className="text-[10px] font-mono uppercase text-gray-400 mb-1">Media</span>
                              <span className="font-bold text-xs md:text-sm uppercase text-design-black">{details.media}</span>
                          </div>
                  </div>

                  <div className="mt-auto">
                    <Comments projectId={selectedProject.id} />
                  </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      </AnimatePresence>

      <AnimatePresence>
        {viewHighRes && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
                onClick={() => setViewHighRes(null)}
            >
                <button 
                    onClick={() => setViewHighRes(null)}
                    className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all z-50 focus:outline-none focus:ring-2 focus:ring-white"
                >
                    <X size={24} />
                </button>

                <motion.img
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    src={viewHighRes}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    onClick={(e) => e.stopPropagation()} 
                    onError={handleImageError}
                />
                
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-xs font-mono uppercase tracking-widest pointer-events-none">
                    Original High-Fidelity Asset
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Portfolio;