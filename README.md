# 🌐 VF Technologies — Immersive Digital & Telecom Infrastructure Experience

[![Live Site](https://img.shields.io/badge/Live_Site-vf--technologies.com-00d4ff?style=for-the-badge&logo=googlechrome&logoColor=white)](https://vf-technologies.com)
[![GitHub Repo](https://img.shields.io/badge/GitHub-VF--Technologies--_Repo-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/srinath9121/VF-Technologies-)
[![Tech Stack](https://img.shields.io/badge/Stack-React_19_%7C_Three.js_%7C_GSAP_%7C_Lenis-00ffaa?style=for-the-badge)](https://vf-technologies.com)

A high-performance, scroll-driven **3D WebGL web application** for **VF Technologies**, an industry leader in Outside Plant (OSP) Fiber Engineering, Structural Pole Analysis, and Telecom Utility Infrastructure.

---

## 💎 Experience Highlights

- **🔬 Signature 3D Fiber Optic Tunnel Journey**: As users scroll past the Hero section, the camera physically plunges **inside** a high-density fiber-optic cable conduit (`TubeGeometry`), traveling past glowing multi-color buffer strands and high-speed data light pulses.
- **🎥 Master Camera Choreography**: Camera movement is smoothly interpolated along a `CatmullRomCurve3` 3D spline using **GSAP ScrollTrigger** and **Lenis** hardware-accelerated smooth scroll physics.
- **📊 Real-Time Engineering Telemetry**: Live HUD badges update dynamically as the user travels through chapters—providing live readout on fiber counts, link loss budgets, and structural safety factors.
- **🎨 Editorial Art Direction**: Deep dark architectural aesthetic, disciplined HSL cyan/teal accent palette, zero visual clutter, and responsive layout across desktop, tablet, and mobile.
- **⚡ High Performance & Zero-Lag**: Built on **React 19** and **Vite** with a single persistent Three.js WebGL canvas container to maintain 60 FPS without memory leaks or context loss.

---

## 🏛️ Interactive Narrative Chapters

| Chapter | Title | 3D Visual & Story Feature |
| :--- | :--- | :--- |
| **00** | **Origin & Mission** | Architectural slate space with ambient fiber core reactor |
| **01** | **OSP Fiber Infrastructure** | Camera approaches, grows, and enters the interior fiber conduit |
| **02** | **Permitting & Engineering** | Clean CAD plan-and-profile blueprint elevation map |
| **03** | **Network Topology** | Multi-node dense WDM spatial network constellation |
| **04** | **Pole Loading & Structural** | Finite-element utility pole structural stress & NESC loading sweep |
| **05** | **Traffic Control (TTC)** | Low-angle work zone road safety infrastructure layout |
| **06** | **App Design & Workflows** | Floating 3D GIS mobile workflow & telemetry platform |
| **07** | **Clients & Trust** | Carrier-grade partner trust matrix & field verification stats |
| **08** | **Careers & Culture** | Human-centric engineering team culture & position highlights |
| **09** | **Contact & Terminal** | Architectural contact form and office location matrix |

---

## 🛠️ Technology Stack

### Frontend & WebGL Application (`/vf-site`)
- **Framework**: [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/)
- **3D Graphics**: [Three.js](https://threejs.org/) + [@react-three/fiber](https://r3f.docs.pmnd.rs/) + [@react-three/drei](https://github.com/pmndrs/drei) + [@react-three/postprocessing](https://github.com/pmndrs/postprocessing)
- **Scroll Physics**: [Lenis](https://lenis.darkroom.engineering/) (Quartic easing, hardware-accelerated)
- **Animation & Scrubbing**: [GSAP](https://gsap.com/) + [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- **Synchronization Milestones**: [Anime.js v4](https://animejs.com/) (`onScroll()` sync triggers)
- **Styling**: Vanilla CSS3 (Custom design system tokens, responsive clamp typography)

### Data Extraction Pipeline (`/vf-scraper`)
- **Scraper Engine**: Python (BeautifulSoup4, Requests)
- **Build Mapping**: Node.js automated JS exporter (`build_content.js`) generating static structured React content.

---

## 📂 Project Structure

```text
VF-Technologies/
├── vf-site/                        # Main React + 3D WebGL Application
│   ├── public/                     # Static assets (logo, favicons, icons)
│   ├── src/
│   │   ├── components/
│   │   │   ├── MainScene.jsx       # Central WebGL Canvas & Camera Spline Choreography
│   │   │   ├── Navbar.jsx          # Header navigation & brand group
│   │   │   ├── Hero.jsx            # Chapter 00 Hero layout & headline stagger
│   │   │   ├── About.jsx           # Mission statement & engineering pillars
│   │   │   ├── Services.jsx        # Pinned 6-chapter narrative stage & HUD telemetry
│   │   │   ├── ScrollHUD.jsx       # Floating scroll progress badge & chapter rail
│   │   │   ├── Preloader.jsx       # Branded loading screen & asset initializer
│   │   │   ├── Partners.jsx        # Carrier trust & client marquee
│   │   │   ├── Careers.jsx         # Engineering career opportunities
│   │   │   └── Contact.jsx         # Terminal contact form & office locations
│   │   ├── App.jsx                 # Lenis smooth scroll bridge & master orchestra
│   │   ├── content.js              # Mapped data object for company content
│   │   └── index.css               # Architectural color palette & design tokens
│   └── package.json
│
├── vf-scraper/                     # Scraping & Content Generation Utility
│   ├── data/
│   │   └── vf.json                 # Extracted raw company content
│   ├── build_content.js            # Node script compiling JSON to content.js
│   ├── scraper.py                  # Web crawler script
│   └── requirements.txt
│
├── vercel.json                     # Vercel deployment configuration
├── README.md                       # Project documentation
└── LICENSE
```

---

## 🚀 Quick Start & Local Development

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `yarn`

### 1. Clone the Repository
```bash
git clone https://github.com/srinath9121/VF-Technologies-.git
cd VF-Technologies-
```

### 2. Install & Run Dev Server
```bash
cd vf-site
npm install
npm run dev
```
Open `http://localhost:5173/` in your browser.

### 3. Production Build
```bash
npm run build
```
The optimized production bundle will be generated inside `vf-site/dist/`.

---

## 🌐 Production Deployment

### GoDaddy cPanel Deployment
1. Run `npm run build` inside `vf-site`.
2. Compress the contents of `vf-site/dist` into a `site.zip` file.
3. Upload `site.zip` to GoDaddy **File Manager** inside the **`public_html`** directory.
4. Extract `site.zip` directly in `public_html`.
5. Visit [https://vf-technologies.com](https://vf-technologies.com).

---

## 📄 License & Copyright

© Copyright 2025 **VF Technologies**. All Rights Reserved.  
Engineered with precision for advanced telecom and utility infrastructure.
