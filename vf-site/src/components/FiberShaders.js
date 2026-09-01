import * as THREE from 'three'

// 1. Rayleigh & Mie Atmospheric Scattering Sky Shader (threejs-atmosphere-aerial-perspective)
export const PoeticSkyShader = {
  uniforms: {
    uTime: { value: 0 },
    uColorZenith: { value: new THREE.Color('#01040a') },
    uColorMid: { value: new THREE.Color('#071322') },
    uColorHorizon: { value: new THREE.Color('#0e2238') },
    uColorMist: { value: new THREE.Color('#193754') }
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vWorldPos;

    void main() {
      vUv = uv;
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPos = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColorZenith;
    uniform vec3 uColorMid;
    uniform vec3 uColorHorizon;
    uniform vec3 uColorMist;

    varying vec2 vUv;
    varying vec3 vWorldPos;

    // Simplex Noise for Soft Watercolor Bleed
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      // Rayleigh high-altitude gradient + Mie forward horizon scatter
      float h = clamp((vWorldPos.y + 10.0) / 70.0, 0.0, 1.0);
      vec2 uvNoise = vWorldPos.xz * 0.012 + vec2(uTime * 0.002, 0.0);
      float inkDrift = snoise(uvNoise) * 0.12 + snoise(uvNoise * 2.2) * 0.06;
      float gradH = clamp(h + inkDrift, 0.0, 1.0);

      // Rayleigh blue spectrum
      vec3 skyColor = mix(uColorHorizon, uColorMid, smoothstep(0.0, 0.45, gradH));
      skyColor = mix(skyColor, uColorZenith, smoothstep(0.45, 1.0, gradH));
      
      // Mie forward horizon glow
      float mieScatter = exp(-pow((vWorldPos.y - 4.0) * 0.08, 2.0)) * 0.45;
      skyColor = mix(skyColor, uColorMist, mieScatter);

      gl_FragColor = vec4(skyColor, 1.0);
    }
  `
}

// 2. Volumetric Mountain Mist & Low Cloud Layer (threejs-volumetric-clouds)
export const VolumetricMistShader = {
  uniforms: {
    uTime: { value: 0 },
    uSpeed: { value: 0.04 },
    uColorMist: { value: new THREE.Color('#38bdf8') },
    uColorShadow: { value: new THREE.Color('#030b14') },
    uDensity: { value: 0.45 }
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vWorldPos;

    void main() {
      vUv = uv;
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPos = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uSpeed;
    uniform vec3 uColorMist;
    uniform vec3 uColorShadow;
    uniform float uDensity;

    varying vec2 vUv;
    varying vec3 vWorldPos;

    // FBM Noise for Volumetric Cloud Density
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f*f*(3.0-2.0*f);
      return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
                 mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
    }
    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      for (int i = 0; i < 4; i++) {
        v += a * noise(p);
        p = p * 2.0 + vec2(100.0);
        a *= 0.5;
      }
      return v;
    }

    void main() {
      vec2 uvDrift = vWorldPos.xz * 0.035 + vec2(uTime * uSpeed, uTime * uSpeed * 0.4);
      float cloudDensity = fbm(uvDrift);

      // Beer-Lambert Light Absorption
      float beerLaw = exp(-cloudDensity * 2.5);
      
      // Feathered edges
      float edgeFade = smoothstep(0.0, 0.4, vUv.x) * smoothstep(1.0, 0.6, vUv.x)
                     * smoothstep(0.0, 0.4, vUv.y) * smoothstep(1.0, 0.6, vUv.y);

      float alpha = cloudDensity * edgeFade * uDensity;
      vec3 mistCol = mix(uColorShadow, uColorMist, cloudDensity * (1.0 - beerLaw));

      gl_FragColor = vec4(mistCol, alpha);
    }
  `
}

// 3. Volumetric Beacon God Ray Light Cone (threejs-raymarched-space-effects)
export const VolumetricLightConeShader = {
  uniforms: {
    uTime: { value: 0 },
    uColorBeam: { value: new THREE.Color('#38bdf8') },
    uColorCore: { value: new THREE.Color('#ffffff') },
    uIntensity: { value: 1.0 }
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColorBeam;
    uniform vec3 uColorCore;
    uniform float uIntensity;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);

      // Light cone longitudinal falloff (origin at top apex vUv.y = 1.0)
      float beamFalloff = pow(1.0 - vUv.y, 1.4);
      
      // Soft radial edge fade
      float rimFade = pow(1.0 - abs(dot(viewDir, normal)), 1.5);
      
      // Subtle atmospheric pulsation
      float pulse = 0.85 + 0.15 * sin(uTime * 3.0);

      float alpha = beamFalloff * rimFade * 0.45 * uIntensity * pulse;
      vec3 col = mix(uColorBeam, uColorCore, pow(beamFalloff, 3.0) * 0.7);

      gl_FragColor = vec4(col, alpha);
    }
  `
}

// 4. Poetic Mountain Ridge Shader
export const TerrainEdgeGlowShader = {
  uniforms: {
    uTime: { value: 0 },
    uLayerIndex: { value: 0.0 },
    uColorBase: { value: new THREE.Color('#030712') },
    uColorMist: { value: new THREE.Color('#162f48') },
    uColorRim: { value: new THREE.Color('#38bdf8') }
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPos;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPos = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uLayerIndex;
    uniform vec3 uColorBase;
    uniform vec3 uColorMist;
    uniform vec3 uColorRim;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPos;

    void main() {
      float h = clamp(vUv.y, 0.0, 1.0);
      float crestGlow = pow(h, 2.4) * (1.0 - abs(vUv.x - 0.5) * 1.6);
      crestGlow = clamp(crestGlow, 0.0, 1.0);
      float distHaze = smoothstep(10.0, 65.0, length(vWorldPos.xz));

      vec3 mountainCol = mix(uColorBase, uColorMist, h * 0.75);
      mountainCol = mix(mountainCol, uColorRim, crestGlow * 0.65);
      mountainCol = mix(mountainCol, uColorMist, distHaze * 0.55);

      gl_FragColor = vec4(mountainCol, 0.98);
    }
  `
}

// 5. Poetic Water Surface Shader
export const WaterReflectiveShader = {
  uniforms: {
    uTime: { value: 0 },
    uMonolithPos: { value: new THREE.Vector3(0, 0, 0) },
    uColorWater: { value: new THREE.Color('#01050d') },
    uColorGlow: { value: new THREE.Color('#00d4ff') },
    uScroll: { value: 0 }
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vWorldPos;
    varying vec3 vNormal;

    void main() {
      vUv = uv;
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      float wave1 = sin(worldPos.x * 0.4 + worldPos.z * 0.3 + 0.0) * 0.06;
      float wave2 = cos(worldPos.x * 0.8 - worldPos.z * 0.5 + 0.0) * 0.03;
      worldPos.y += wave1 + wave2;

      vWorldPos = worldPos.xyz;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uMonolithPos;
    uniform vec3 uColorWater;
    uniform vec3 uColorGlow;
    uniform float uScroll;

    varying vec2 vUv;
    varying vec3 vWorldPos;
    varying vec3 vNormal;

    void main() {
      vec2 p = vWorldPos.xz * 0.5;
      float gentleRipple = sin(p.x * 2.0 + uTime * 1.2) * cos(p.y * 2.0 + uTime * 0.9) * 0.5 + 0.5;
      vec2 dToTower = vWorldPos.xz - uMonolithPos.xz;
      float colReflect = exp(-pow(dToTower.x * 0.4, 2.0) - abs(dToTower.y) * 0.05) * 1.4;
      colReflect *= (0.7 + gentleRipple * 0.3);
      float depthFade = smoothstep(55.0, 8.0, length(vWorldPos.xz));

      vec3 finalCol = mix(uColorWater, uColorGlow, clamp(colReflect * 0.65, 0.0, 1.0));
      finalCol += vec3(0.1, 0.4, 0.7) * pow(gentleRipple, 3.0) * 0.1 * colReflect;

      gl_FragColor = vec4(finalCol, depthFade * 0.96);
    }
  `
}

// 6. Optical Fiber Pulse Shader
export const FiberPulseShader = {
  uniforms: {
    uTime: { value: 0 },
    uSpeed: { value: 2.2 },
    uColorCore: { value: new THREE.Color('#ffffff') },
    uColorGlow: { value: new THREE.Color('#00d4ff') },
    uOpacity: { value: 1.0 }
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uSpeed;
    uniform vec3 uColorCore;
    uniform vec3 uColorGlow;
    uniform float uOpacity;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      float wave = sin(vUv.x * 60.0 - uTime * uSpeed * 8.0) * 0.5 + 0.5;
      float packet = sin(vUv.x * 10.0 - uTime * uSpeed * 2.0) * 0.5 + 0.5;
      float intensity = pow(wave * packet, 3.0) * 3.5;

      vec3 col = mix(uColorGlow, uColorCore, intensity * 0.8);
      float alpha = clamp(intensity * 0.9 + 0.15, 0.0, 1.0) * uOpacity;

      gl_FragColor = vec4(col, alpha);
    }
  `
}
