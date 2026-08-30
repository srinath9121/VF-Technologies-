# Volks Resources — Corporate Website

A premium, scroll-driven single-page corporate website for **Volks Resources**, a US-based telecom & utility infrastructure company.

---

## Animation Stack

### 1. Lenis — Smooth Scroll Physics
- Duration: `0.8` (quartic ease-out, zero floaty lag)
- Synced to GSAP ticker for frame-perfect scroll updates
- **File:** `App.jsx`

### 2. GSAP + ScrollTrigger — Cinematic Scroll Animations
- **Navbar.jsx** — Slide-down entrance on load + active section tracking
- **Hero.jsx** — Staggered timeline: tagline → headline → subtitle → CTAs
- **Services.jsx** — Full-page scroll-pinned scrub (3 phases)
- **Stats.jsx** — Counter animations on viewport entry
- **Careers.jsx** — Scale + fade card entrance on scroll

### 3. Anime.js — Scroll-Synced Micro-Animations
- **Hero.jsx** — Content fades + translates up as you scroll away
- **About.jsx** — Image stack & value cards horizontal parallax
- **Stats.jsx** — 3D rotateY tilt on stat cards synced to scroll
- **Partners.jsx** — Logo marquee synced right-to-left with scroll
- **Contact.jsx** — Office cards 3D rotateX flip on scroll
- **ScrollHUD.jsx** — Top progress bar synced to total scroll depth
- **Careers.jsx** — Staggered entrance + breathing glow on CTA button
- **Navbar.jsx** — Neon glow pulse on active nav link on section change

### 4. Three.js — Live 3D WebGL Background
- `ThreeCanvas.jsx` — 1,600 fiber optic strands, scroll-driven zoom
- `Service3DStage.jsx` — 3D phase switcher inside Services section

---

## Getting Started

```bash
cd volks-site && npm install
npm run dev        # http://localhost:5173
npm run build      # Production build
```

**Repo:** https://github.com/srinath9121/volks
