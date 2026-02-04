import { Project } from '../types';

// Helper to generate projects
const generateProjects = (startId: number, count: number): Project[] => {
  return Array.from({ length: count }, (_, i) => {
    const id = startId + i;
    const categories = ["Garment", "Textile", "Sketches", "Illustration"];
    const category = categories[i % categories.length];
    const titles = ["Tension", "Velocity", "Balance", "Torque", "Pivot", "Vault", "Landing", "Grip", "Chalk", "Rhythm", "Axis", "Flex", "Momentum", "Apex", "Form", "Structure", "Dynamic"];
    const title = `${titles[i % titles.length]} ${i + 1}`;
    
    return {
      id,
      title: title.toUpperCase(),
      category,
      image: `https://picsum.photos/seed/${id * 123}/800/1000`, 
      description: `Exploration of ${category.toLowerCase()} dynamics through the lens of athletic performance.`,
      year: (2020 + (i % 5)).toString()
    };
  });
};

// --- PORTFOLIO PROJECTS ---
const initialProjects: Project[] = [
  {
    id: 1,
    title: "SIMPSON TEXTILES",
    category: "Garment",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1287&auto=format&fit=crop", 
    description: "Experimental approach to wearable architecture using reclaimed materials and gymnastic tension principles.",
    year: "2025",
    downloadUrl: "#"
  },
  {
    id: 2,
    title: "FORM & FLOW",
    category: "Sketches",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1320&auto=format&fit=crop",
    description: "Digital explorations of human movement translated into vector geometry and fluid color palettes.",
    year: "2024"
  },
  {
    id: 3,
    title: "AERODYNAMIC BRANDING",
    category: "Garment",
    image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=1286&auto=format&fit=crop",
    description: "A complete identity for a high-performance athletic apparel brand, focused on speed and minimal wind resistance.",
    year: "2025"
  }
];

export const portfolioProjects: Project[] = [
  ...initialProjects,
  ...generateProjects(4, 17) // Generates 17 more to reach 20 total initial projects
];

// --- TIMELINE EVENTS ---
export const timelineEvents = [
  { 
    year: '2025', 
    title: 'Simpson Studio Launch', 
    desc: 'Founded a multidisciplinary design studio at the intersection of athletic performance and visual identity.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1470&auto=format&fit=crop'
  },
  { 
    year: '2023', 
    title: 'Artistic Excellence Award', 
    desc: 'Recognized for innovation in wearable technology and material science at the National Design Forum.',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1288&auto=format&fit=crop'
  },
  { 
    year: '2021', 
    title: 'Lead Pattern Designer', 
    desc: 'Developed ergonomic seam technologies for Vertex Athletics, reducing garment friction by 40%.',
    image: 'https://images.unsplash.com/photo-1517960413843-0aee8e2b3285?q=80&w=1499&auto=format&fit=crop'
  },
  { 
    year: '2019', 
    title: 'Parsons Graduation', 
    desc: 'BFA in Fashion Design with a thesis on "Structural Integrity in Motion".',
    image: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?q=80&w=1466&auto=format&fit=crop'
  },
  { 
    year: '2016', 
    title: 'State Championship', 
    desc: 'Gold Medalist in Floor Exercise. The discipline learned here defines my design rigor today.',
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1386&auto=format&fit=crop'
  },
  { 
    year: '2014', 
    title: 'The First Prototype', 
    desc: 'Began customizing competition leotards, discovering the dialogue between fabric and physique.',
    image: 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?q=80&w=1470&auto=format&fit=crop'
  }
];

// --- VISUAL DIARY ---
export const visualDiaryItems = [
    { title: "BTS Shoot", img: "https://images.unsplash.com/photo-1523381235208-255f7d02c62a?q=80&w=1470&auto=format&fit=crop", offset: 20 },
    { title: "Sketch Phase", img: "https://images.unsplash.com/photo-1512446816042-444d641267d4?q=80&w=1470&auto=format&fit=crop", offset: -20 },
    { title: "Final Fit", img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1470&auto=format&fit=crop", offset: 30 }
];

// --- FEATURED PROJECT ---
export const featuredProjectData = {
    title: "TITANIUM FLOW COLLECTION",
    description: "The crown jewel of current collection. Exploring the weightlessness of metallic fabrics in a 6-minute floor routine simulation.",
    image: "https://images.unsplash.com/photo-1537832816519-689ad163238b?q=80&w=1459&auto=format&fit=crop",
    stats: [
        { value: "01", label: "Unique" },
        { value: "100%", label: "Handcrafted" }
    ]
};