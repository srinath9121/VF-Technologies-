const fs = require('fs');
const path = require('path');

// Read the scraped JSON
const dataPath = path.join(__dirname, 'data', 'vf.json');
const rawData = fs.readFileSync(dataPath, 'utf-8');
const scraped = JSON.parse(rawData);

// Map the scraped arrays to structured objects for React
const contentJS = `// Auto-generated from data/vf.json via Option 1 Static Integration

export const hero = {
  tagline: "${scraped.headings[1] || 'Version 2.0 is officially live'}",
  headlines: [
    "${scraped.headings[2] || 'Build, Customize, and Launch Your SaaS in Minutes'}",
    "Streamline Your Journey from Launch to Growth",
    "Smart, Scalable Tools That Adapt to Your Business"
  ],
  subtitle: "${scraped.paragraphs[1] || 'Streamline your journey from launch to growth...'}",
  logo: "/logo.jpg"
};

export const about = {
  heading: "${scraped.headings[4] || 'We help ambitious businesses grow'}",
  mission: "${scraped.paragraphs[2] || 'We partner with ambitious businesses...'}",
  paragraphs: [
    "${scraped.paragraphs[2]}",
    "${scraped.paragraphs[3]}",
    "${scraped.paragraphs[4]}"
  ],
  values: [
    { name: "${scraped.headings[17].replace('+', '') || 'Growth-Driven Strategy'}", icon: "${scraped.images[20] || ''}" },
    { name: "${scraped.headings[18].replace('+', '') || 'Tailored Solutions'}", icon: "${scraped.images[21] || ''}" },
    { name: "${scraped.headings[19].replace('+', '') || 'Modern Technology'}", icon: "${scraped.images[22] || ''}" },
    { name: "Innovation", icon: "${scraped.images[23] || ''}" },
    { name: "Collaboration", icon: "${scraped.images[24] || ''}" },
    { name: "Excellence", icon: "${scraped.images[25] || ''}" }
  ],
  images: [
    "${scraped.images[3]}",
    "${scraped.images[26]}"
  ]
};

export const stats = [
  { value: 250, suffix: "+", label: "Projects Delivered" },
  { value: 150, suffix: "+", label: "Happy Clients" },
  { value: 20, suffix: "+", label: "Years of Industry Experience" },
  { value: 98, suffix: "%", label: "Client Satisfaction" }
];

export const whyUs = [
  {
    title: "${scraped.headings[17].replace('+', '')}",
    desc: "${scraped.paragraphs[8]}"
  },
  {
    title: "${scraped.headings[18].replace('+', '')}",
    desc: "${scraped.paragraphs[9]}"
  },
  {
    title: "${scraped.headings[19].replace('+', '')}",
    desc: "${scraped.paragraphs[10]}"
  }
];

export const services = [
  {
    title: "Website Design",
    description: "${scraped.paragraphs[16] || 'We design and build high-performance websites...'}",
    image: "${scraped.images[29]}",
    icon: "${scraped.images[9]}",
    subsections: ["UI/UX Design", "Responsive Layouts", "CMS Integration", "Performance Optimization"]
  },
  {
    title: "SEO & Marketing",
    description: "${scraped.paragraphs[18] || 'We develop results-driven digital marketing strategies...'}",
    image: "${scraped.images[32]}",
    icon: "${scraped.images[10]}",
    subsections: ["Search Engine Optimization", "Paid Advertising (PPC)", "Content Marketing", "Conversion Rate Optimization"]
  },
  {
    title: "Brand Identity & SaaS",
    description: "${scraped.paragraphs[17] || 'We create complete brand identities...'}",
    image: "${scraped.images[31]}",
    icon: "${scraped.images[4]}",
    subsections: ["Brand Strategy", "SaaS Platform Development", "Product Design", "Startup Consulting"]
  }
];

export const leadership = [
  {
    name: "${scraped.headings[42] || 'John Doe'}",
    title: "${scraped.paragraphs[20] || 'Chief Technology Officer'}",
    bio: "Leading technology vision and product architecture at VF Technologies, driving innovation and scalable digital solutions for clients worldwide.",
    image: "${scraped.images[15]}"
  },
  {
    name: "${scraped.headings[43] || 'Olivia Bennett'}",
    title: "${scraped.paragraphs[21] || 'Chief Marketing Officer'}",
    bio: "Olivia leads growth strategy and brand positioning at VF Technologies, crafting data-driven marketing campaigns that accelerate client success.",
    image: "${scraped.images[16]}"
  },
  {
    name: "${scraped.headings[44] || 'Ethan Carter'}",
    title: "${scraped.paragraphs[22] || 'Full-Stack Engineer'}",
    bio: "Ethan builds the high-performance web platforms and SaaS solutions that power VF Technologies' client projects, with expertise in modern frameworks.",
    image: "${scraped.images[17]}"
  }
];

export const careers = {
  heading: "Build What's Next With Us",
  subtitle: "Join a team of innovators, designers, and engineers building digital solutions that make a real difference for ambitious businesses worldwide.",
  cta: "We're always looking for passionate, talented people to join our growing team. Explore open roles and become part of the VF Technologies story."
};

export const contact = {
  heading: "Let's Build What's Next",
  subtitle: "Whether you're launching or scaling, we're here to help you achieve your next milestone. Fill out the form and our team will get back to you promptly.",
  offices: [
    {
      region: "Global",
      phone: "+1 (000) 000-0000",
      email: "${scraped.headings[60] || 'sample@example.com'}",
      address: "VF Technologies, Global Headquarters"
    }
  ]
};

export const testimonials = [
  {
    quote: "${scraped.paragraphs[23]}",
    source: "${scraped.headings[47]} — ${scraped.paragraphs[24]}"
  },
  {
    quote: "${scraped.paragraphs[25]}",
    source: "${scraped.headings[48]} — ${scraped.paragraphs[24]}"
  },
  {
    quote: "${scraped.paragraphs[26]}",
    source: "${scraped.headings[49]} — ${scraped.paragraphs[27]}"
  }
];

export const clients = [
  "${scraped.images[5]}",
  "${scraped.images[6]}",
  "${scraped.images[7]}",
  "${scraped.images[8]}",
  "${scraped.images[5]}",
  "${scraped.images[6]}",
  "${scraped.images[7]}",
  "${scraped.images[8]}"
];
`;

const outputPath = path.join(__dirname, '..', 'vf-site', 'src', 'content.js');
fs.writeFileSync(outputPath, contentJS, 'utf-8');
console.log('Successfully mapped vf.json to React content.js via Static Integration!');
