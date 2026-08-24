import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  RotateCw, 
  Layers, 
  Sun, 
  Moon, 
  Sunset, 
  Maximize2, 
  Eye, 
  Box, 
  Compass, 
  Sliders,
  Info
} from 'lucide-react';
import { Model3DConfig, Language } from '../types';

interface ThreeArchViewerProps {
  config: Model3DConfig;
  projectName: string;
  lang: Language;
}

export default function ThreeArchViewer({ config, projectName, lang }: ThreeArchViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [explodedView, setExplodedView] = useState(false);
  const [explodeFactor, setExplodeFactor] = useState(0);
  const [lightingMode, setLightingMode] = useState<'day' | 'sunset' | 'night'>('sunset');
  const [autoRotate, setAutoRotate] = useState(true);
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);

  // References for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const floorMeshesRef = useRef<{ mesh: THREE.Object3D; basePosY: number; index: number }[]>([]);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });

  const isFa = lang === 'fa';
  const isPs = lang === 'ps';

  // Hotspot definitions based on project model
  const hotspots = [
    {
      id: 'core',
      titleFa: 'هسته بتنی مرکزی ضدزلزله',
      titleEn: 'Seismic Post-Tensioned Core',
      titlePs: 'د زلزلې ضد مرکزي هسته',
      descFa: 'طراحی شده برای مقاومت در برابر شتاب زلزله تا ۹ ریشتر با میلگردهای کششی پرمقاومت',
      descEn: 'Engineered with high-tensile tendons to absorb extreme lateral wind & seismic shear loads',
      descPs: 'د لوړ مقاومت سټیل او کانکریټ په مرسته د زلزلې ضد کلکه هسته',
      yRel: 0.45,
    },
    {
      id: 'gardens',
      titleFa: 'تراس‌های معلق زیست‌اقلیمی',
      titleEn: 'Biophilic Sky Terraces',
      titlePs: 'شنه معلق بالکونونه',
      descFa: 'باغ‌های عمودی با پوشش گیاهی بومی و تصفیه طبیعی هوای فضاهای اداری',
      descEn: 'Cascading vertical greenery improving internal air quality and reducing urban heat',
      descPs: 'طبیعي شنه بوټي او د هوا پاکوونکي باغچې',
      yRel: 0.65,
    },
    {
      id: 'facade',
      titleFa: 'پوسته هوشمند شیشه‌ای Low-E',
      titleEn: 'Smart Low-E Solar Curtain Wall',
      titlePs: 'د لمر ضد ښیښه‌يي دېوال',
      descFa: 'کاهش اتلاف حرارتی زمستان و جذب ۶۵٪ کمتر گرمای تابستان',
      descEn: 'Triple-glazed dynamic coating filtering 99% UV while harvesting solar electricity',
      descPs: 'د تودوخې او سړې هوا ضد ۳ پوړیزه شیشې',
      yRel: 0.25,
    },
    {
      id: 'roof',
      titleFa: 'باند فرود هلی‌پد و عرشه پانوراما',
      titleEn: 'Rooftop Helipad & Sky Arena',
      titlePs: 'د چورلکې ځای او پورتنی تالار',
      descFa: 'دسترسی اضطراری امدادی و دید ۳۶۰ درجه پانوراما از شهر و رشته کوه‌های اطراف',
      descEn: 'Emergency medical helicopter landing deck and 360° summit viewing observatory',
      descPs: 'د عاجلو مرستو او چورلکې ناستې ځای',
      yRel: 0.95,
    },
  ];

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(lightingMode === 'night' ? 0x0a0c10 : lightingMode === 'sunset' ? 0x18121a : 0x0f172a);
    scene.fog = new THREE.FogExp2(lightingMode === 'night' ? 0x0a0c10 : lightingMode === 'sunset' ? 0x18121a : 0x0f172a, 0.012);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(28, 22, 34);
    camera.lookAt(0, 8, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    // Clean previous children
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const dirLight = new THREE.DirectionalLight(0xfff1db, 1.8);
    dirLight.position.set(30, 45, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 120;
    dirLight.shadow.camera.left = -30;
    dirLight.shadow.camera.right = 30;
    dirLight.shadow.camera.top = 30;
    dirLight.shadow.camera.bottom = -30;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.6);
    fillLight.position.set(-20, 20, -20);
    scene.add(fillLight);

    // 5. Ground Grid & Plaza
    const groundGeo = new THREE.PlaneGeometry(160, 160);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.85,
      metalness: 0.2,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.05;
    ground.receiveShadow = true;
    scene.add(ground);

    const gridHelper = new THREE.GridHelper(100, 50, 0x38bdf8, 0x1e293b);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    // Plaza podium
    const podiumGeo = new THREE.CylinderGeometry(14, 15, 0.8, 32);
    const podiumMat = new THREE.MeshStandardMaterial({
      color: 0x1f2937,
      roughness: 0.6,
      metalness: 0.3,
    });
    const podium = new THREE.Mesh(podiumGeo, podiumMat);
    podium.position.y = 0.4;
    podium.receiveShadow = true;
    scene.add(podium);

    // 6. Build the 3D Architectural Model
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;
    floorMeshesRef.current = [];

    buildArchitecturalModel(modelGroup, config);

    // 7. Mouse Orbit Handlers
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !modelGroupRef.current) return;
      const deltaX = e.clientX - prevMousePosRef.current.x;
      const deltaY = e.clientY - prevMousePosRef.current.y;
      modelGroupRef.current.rotation.y += deltaX * 0.008;
      
      if (cameraRef.current) {
        cameraRef.current.position.y = Math.max(5, Math.min(45, cameraRef.current.position.y - deltaY * 0.1));
        cameraRef.current.lookAt(0, 8, 0);
      }
      prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      const zoomSpeed = 0.04;
      const dist = cameraRef.current.position.length();
      if ((e.deltaY > 0 && dist < 70) || (e.deltaY < 0 && dist > 12)) {
        cameraRef.current.position.multiplyScalar(1 + (e.deltaY > 0 ? zoomSpeed : -zoomSpeed));
        cameraRef.current.lookAt(0, 8, 0);
      }
    };

    // Touch handlers for mobile/tablet
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        prevMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || !modelGroupRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMousePosRef.current.x;
      const deltaY = e.touches[0].clientY - prevMousePosRef.current.y;
      modelGroupRef.current.rotation.y += deltaX * 0.008;
      if (cameraRef.current) {
        cameraRef.current.position.y = Math.max(5, Math.min(45, cameraRef.current.position.y - deltaY * 0.1));
        cameraRef.current.lookAt(0, 8, 0);
      }
      prevMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => {
      isDraggingRef.current = false;
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domElem.addEventListener('wheel', onWheel, { passive: false });
    domElem.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height;
        if (newWidth > 0 && newHeight > 0 && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = newWidth / newHeight;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(container);

    // 8. Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (autoRotate && modelGroupRef.current && !isDraggingRef.current) {
        modelGroupRef.current.rotation.y += 0.004;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      resizeObserver.disconnect();
      domElem.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElem.removeEventListener('wheel', onWheel);
      domElem.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      renderer.dispose();
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, [config]);

  // Handle Exploded View updates
  useEffect(() => {
    const factor = explodedView ? (explodeFactor > 0 ? explodeFactor : 1.2) : 0;
    floorMeshesRef.current.forEach((item) => {
      const targetY = item.basePosY + item.index * factor * 0.9;
      item.mesh.position.y = targetY;
    });
  }, [explodedView, explodeFactor]);

  // Handle Lighting / Sun Mode updates
  useEffect(() => {
    if (!sceneRef.current || !dirLightRef.current || !ambientLightRef.current) return;
    const scene = sceneRef.current;
    const dirLight = dirLightRef.current;
    const ambientLight = ambientLightRef.current;

    if (lightingMode === 'day') {
      scene.background = new THREE.Color(0x0f172a);
      scene.fog = new THREE.FogExp2(0x0f172a, 0.012);
      ambientLight.color.setHex(0xffffff);
      ambientLight.intensity = 1.0;
      dirLight.color.setHex(0xfff7ed);
      dirLight.intensity = 2.2;
      dirLight.position.set(30, 45, 20);
    } else if (lightingMode === 'sunset') {
      scene.background = new THREE.Color(0x1a121d);
      scene.fog = new THREE.FogExp2(0x1a121d, 0.014);
      ambientLight.color.setHex(0xfb923c);
      ambientLight.intensity = 0.7;
      dirLight.color.setHex(0xf97316);
      dirLight.intensity = 2.4;
      dirLight.position.set(40, 15, 30);
    } else if (lightingMode === 'night') {
      scene.background = new THREE.Color(0x05070c);
      scene.fog = new THREE.FogExp2(0x05070c, 0.016);
      ambientLight.color.setHex(0x1e293b);
      ambientLight.intensity = 0.4;
      dirLight.color.setHex(0x38bdf8);
      dirLight.intensity = 0.8;
      dirLight.position.set(-20, 30, -20);
    }
  }, [lightingMode]);

  // Handle Wireframe toggle
  useEffect(() => {
    if (!modelGroupRef.current) return;
    modelGroupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(m => { m.wireframe = wireframeMode; });
        } else {
          child.material.wireframe = wireframeMode;
        }
      }
    });
  }, [wireframeMode]);

  // Helper: Build the procedural architectural geometry
  function buildArchitecturalModel(group: THREE.Group, cfg: Model3DConfig) {
    const floorCount = cfg.floors || 20;
    const floorHeight = 0.9;
    const baseRadius = 6.5;

    // Central Seismic Reinforced Core
    const coreGeo = new THREE.BoxGeometry(3.6, floorCount * floorHeight + 2, 3.6);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.9,
      metalness: 0.1,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.y = (floorCount * floorHeight) / 2 + 0.8;
    coreMesh.castShadow = true;
    coreMesh.receiveShadow = true;
    group.add(coreMesh);

    // Floor Slabs and Glass Curtain Facade
    for (let i = 0; i < floorCount; i++) {
      const floorGroup = new THREE.Group();
      const currentY = 0.8 + i * floorHeight;
      floorGroup.position.y = currentY;

      // Floor slab
      const twist = (i / floorCount) * 0.6;
      const taper = 1.0 - (i / floorCount) * 0.22;
      const slabRadius = baseRadius * taper;

      const slabGeo = new THREE.BoxGeometry(slabRadius * 1.5, 0.22, slabRadius * 1.3);
      const slabMat = new THREE.MeshStandardMaterial({
        color: 0x334155,
        roughness: 0.7,
        metalness: 0.3,
      });
      const slab = new THREE.Mesh(slabGeo, slabMat);
      slab.rotation.y = twist;
      slab.castShadow = true;
      slab.receiveShadow = true;
      floorGroup.add(slab);

      // Glass Curtain Wall
      const glassGeo = new THREE.BoxGeometry(slabRadius * 1.44, floorHeight - 0.22, slabRadius * 1.24);
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: i % 4 === 0 ? 0x38bdf8 : 0x0284c7,
        roughness: 0.1,
        metalness: 0.8,
        transmission: 0.85,
        thickness: 0.6,
        transparent: true,
        opacity: 0.75,
      });
      const glass = new THREE.Mesh(glassGeo, glassMat);
      glass.position.y = (floorHeight - 0.22) / 2;
      glass.rotation.y = twist;
      glass.castShadow = true;
      floorGroup.add(glass);

      // Vertical Columns Frame
      const colMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });
      const colGeo = new THREE.CylinderGeometry(0.12, 0.12, floorHeight, 8);
      const colOffset = slabRadius * 0.65;

      const colPositions = [
        [colOffset, colOffset],
        [-colOffset, colOffset],
        [colOffset, -colOffset],
        [-colOffset, -colOffset],
      ];

      colPositions.forEach(([cx, cz]) => {
        const col = new THREE.Mesh(colGeo, colMat);
        col.position.set(cx, (floorHeight - 0.22) / 2, cz);
        col.rotation.y = twist;
        floorGroup.add(col);
      });

      // Periodic Cantilevered Biophilic Sky Gardens every 4 floors
      if (cfg.hasRoofGarden && i > 0 && i % 4 === 0) {
        const gardenGeo = new THREE.BoxGeometry(slabRadius * 0.6, 0.3, slabRadius * 0.5);
        const gardenMat = new THREE.MeshStandardMaterial({
          color: 0x10b981,
          roughness: 0.9,
        });
        const garden = new THREE.Mesh(gardenGeo, gardenMat);
        garden.position.set(slabRadius * 0.75, 0.15, 0);
        garden.rotation.y = twist;
        garden.castShadow = true;
        floorGroup.add(garden);

        // Small vegetation spheres
        const plantGeo = new THREE.SphereGeometry(0.25, 8, 8);
        const plantMat = new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.8 });
        for (let p = 0; p < 4; p++) {
          const plant = new THREE.Mesh(plantGeo, plantMat);
          plant.position.set(
            slabRadius * 0.75 + (Math.random() - 0.5) * 1.5,
            0.4,
            (Math.random() - 0.5) * 1.2
          );
          floorGroup.add(plant);
        }
      }

      group.add(floorGroup);
      floorMeshesRef.current.push({
        mesh: floorGroup,
        basePosY: currentY,
        index: i,
      });
    }

    // Rooftop Helipad and Mechanical Crown
    const topY = 0.8 + floorCount * floorHeight;
    const helipadGeo = new THREE.CylinderGeometry(4.5, 4.5, 0.4, 24);
    const helipadMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.6,
      metalness: 0.4,
    });
    const helipad = new THREE.Mesh(helipadGeo, helipadMat);
    helipad.position.y = topY + 0.3;
    helipad.castShadow = true;
    group.add(helipad);

    // Helipad 'H' Decal ring
    const ringGeo = new THREE.RingGeometry(2.5, 2.8, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = topY + 0.52;
    group.add(ring);
  }

  return (
    <div id="three-arch-container" className="relative w-full h-[540px] sm:h-[620px] bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl select-none">
      {/* 3D WebGL Canvas */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Overlay Badge & Project Name */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
        <div className="bg-neutral-900/90 backdrop-blur-md border border-neutral-800 rounded-xl px-4 py-2 flex items-center gap-3 shadow-lg pointer-events-auto">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
          <div>
            <div className="text-xs font-bold text-neutral-200 tracking-wide">
              {projectName}
            </div>
            <div className="text-[11px] text-neutral-400 font-mono">
              {config.floors} {isFa ? 'طبقه' : isPs ? 'پوړونه' : 'Floors'} • {config.heightMeters}m {isFa ? 'ارتفاع' : isPs ? 'لوړوالی' : 'Height'}
            </div>
          </div>
        </div>

        {/* Hotspots Info Toggle */}
        <div className="hidden sm:flex items-center gap-2 pointer-events-auto">
          <div className="bg-neutral-900/90 backdrop-blur-md border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-neutral-300 flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>{isFa ? 'قابلیت چرخش ۳۶۰ درجه و زوم با ماوس یا لمس' : isPs ? 'په لمس او ماوس سره ۳۶۰ درجې څرخول' : '360° Interactive Orbit & Zoom'}</span>
          </div>
        </div>
      </div>

      {/* Floating Hotspots Overlay */}
      <div className="absolute top-20 right-4 flex flex-col gap-2 z-10">
        {hotspots.map((hs) => (
          <button
            key={hs.id}
            id={`btn-hotspot-${hs.id}`}
            type="button"
            onClick={() => setSelectedHotspot(selectedHotspot === hs.id ? null : hs.id)}
            className={`px-3 py-1.5 rounded-lg text-xs backdrop-blur-md transition-all flex items-center gap-2 border text-left ${
              selectedHotspot === hs.id
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-lg shadow-amber-500/20'
                : 'bg-neutral-900/80 border-neutral-800 text-neutral-300 hover:bg-neutral-850 hover:text-white'
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="font-medium text-[11px]">
              {isFa ? hs.titleFa : isPs ? hs.titlePs : hs.titleEn}
            </span>
          </button>
        ))}
      </div>

      {/* Selected Hotspot Description Modal */}
      {selectedHotspot && (
        <div className="absolute bottom-24 right-4 left-4 sm:left-auto sm:w-96 bg-neutral-900/95 backdrop-blur-lg border border-amber-500/40 rounded-xl p-4 shadow-2xl z-20 animate-in fade-in slide-in-from-bottom-3 duration-200">
          {(() => {
            const hs = hotspots.find(h => h.id === selectedHotspot);
            if (!hs) return null;
            return (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                    <Info className="w-4 h-4" />
                    <span>{isFa ? hs.titleFa : isPs ? hs.titlePs : hs.titleEn}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedHotspot(null)}
                    className="text-neutral-400 hover:text-white text-xs px-2 py-0.5"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {isFa ? hs.descFa : isPs ? hs.descPs : hs.descEn}
                </p>
              </div>
            );
          })()}
        </div>
      )}

      {/* Bottom Control Bar */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 bg-neutral-950/85 backdrop-blur-md border border-neutral-800 rounded-xl p-2.5 z-10">
        {/* Visual Mode Toggles */}
        <div className="flex items-center gap-1.5">
          {/* Wireframe / Blueprint X-Ray */}
          <button
            id="btn-wireframe-toggle"
            type="button"
            onClick={() => setWireframeMode(!wireframeMode)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all border ${
              wireframeMode
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
            }`}
            title="Structural Wireframe X-Ray"
          >
            <Box className="w-3.5 h-3.5" />
            <span>{isFa ? 'سازه وایرفریم (X-Ray)' : isPs ? 'جوړښت وایرفریم' : 'Structural Wireframe'}</span>
          </button>

          {/* Exploded Floor Section */}
          <button
            id="btn-exploded-toggle"
            type="button"
            onClick={() => setExplodedView(!explodedView)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all border ${
              explodedView
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
            }`}
            title="Exploded Floor Section"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isFa ? 'تفکیک طبقات (Exploded)' : isPs ? 'د پوړونو جلا کول' : 'Exploded Levels'}</span>
          </button>

          {/* Auto Rotate */}
          <button
            id="btn-autorotate-toggle"
            type="button"
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all border ${
              autoRotate
                ? 'bg-neutral-800 text-neutral-200 border-neutral-700'
                : 'bg-neutral-900 border-neutral-800 text-neutral-500'
            }`}
            title="Auto Rotate"
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin-slow text-amber-400' : ''}`} />
            <span className="hidden md:inline">{isFa ? 'چرخش خودکار' : isPs ? 'اتومات څرخول' : 'Auto Rotate'}</span>
          </button>
        </div>

        {/* Sun & Lighting Mode Selector */}
        <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded-lg p-1">
          <button
            id="btn-light-day"
            type="button"
            onClick={() => setLightingMode('day')}
            className={`p-1.5 rounded-md transition-all ${
              lightingMode === 'day' ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
            }`}
            title="Daylight Simulation"
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
          <button
            id="btn-light-sunset"
            type="button"
            onClick={() => setLightingMode('sunset')}
            className={`p-1.5 rounded-md transition-all ${
              lightingMode === 'sunset' ? 'bg-orange-500 text-neutral-950 font-bold shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
            }`}
            title="Sunset Golden Hour"
          >
            <Sunset className="w-3.5 h-3.5" />
          </button>
          <button
            id="btn-light-night"
            type="button"
            onClick={() => setLightingMode('night')}
            className={`p-1.5 rounded-md transition-all ${
              lightingMode === 'night' ? 'bg-indigo-600 text-white font-bold shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
            }`}
            title="Night Illumination"
          >
            <Moon className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Explode Distance Slider (if exploded is active) */}
        {explodedView && (
          <div className="flex items-center gap-2 w-full sm:w-auto px-2">
            <Sliders className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-[11px] text-neutral-400 whitespace-nowrap">
              {isFa ? 'فاصله بازشدگی:' : isPs ? 'واټن:' : 'Separation:'}
            </span>
            <input
              type="range"
              min="0.4"
              max="2.2"
              step="0.1"
              value={explodeFactor || 1.2}
              onChange={(e) => setExplodeFactor(parseFloat(e.target.value))}
              className="w-24 h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>
        )}
      </div>
    </div>
  );
}
