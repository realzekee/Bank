import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { NeonCube, WireSphere, GridBackground, NeonTetrahedron, NeonPyramid } from './NeonCube.jsx';

// WebGL detection
function isWebGLSupported() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && canvas.getContext('webgl'));
  } catch (e) {
    return false;
  }
}

// Fallback component for unsupported WebGL
function WebGLFallback() {
  return (
    <div className="fixed inset-0 w-full h-full z-[-1] bg-gradient-to-br from-black via-purple-900/20 to-black">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_24%,rgba(162,89,255,0.1)_25%,rgba(162,89,255,0.1)_26%,transparent_27%,transparent_74%,rgba(47,255,193,0.1)_75%,rgba(47,255,193,0.1)_76%,transparent_77%,transparent)] bg-[50px_50px]" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="bg-black/80 text-white p-6 rounded-xl border border-neonPurple/30 text-center max-w-md">
          <h3 className="text-lg font-cyber text-neonPurple mb-2">3D Visuals Disabled</h3>
          <p className="text-gray-300">WebGL not supported in your browser. The app will work normally without 3D effects.</p>
        </div>
      </div>
    </div>
  );
}

// Loading component
function CanvasLoader() {
  return (
    <div className="fixed inset-0 w-full h-full z-[-1] bg-black flex items-center justify-center">
      <div className="text-neonPurple text-xl font-cyber animate-pulse">Loading visuals...</div>
    </div>
  );
}

// Main cyberpunk canvas component
export default function CyberpunkCanvas() {
  if (!isWebGLSupported()) {
    return <WebGLFallback />;
  }

  return (
    <div className="fixed inset-0 w-full h-full z-[-1] pointer-events-none">
      <Suspense fallback={<CanvasLoader />}>
        <Canvas
          camera={{ position: [0, 0, 10], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          {/* Lighting */}
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={0.5} color="#a259ff" />
          <pointLight position={[-10, -10, -10]} intensity={0.3} color="#2fffc1" />
          
          {/* 3D Objects */}
          <NeonCube position={[-3, 2, 0]} color="#a259ff" />
          <NeonCube position={[3, -1, -2]} color="#2fffc1" />
          <NeonCube position={[0, 3, -3]} color="#ff2fa0" />
          
          <WireSphere position={[-4, -2, -1]} color="#2fff4f" />
          <WireSphere position={[4, 2, -4]} color="#ff2fa0" />
          
          <NeonTetrahedron position={[-2, -3, -2]} />
          <NeonTetrahedron position={[2, 4, -1]} />
          
          <NeonPyramid position={[0, -4, -3]} />
          
          <GridBackground />
          
          {/* Disabled orbit controls to prevent camera movement */}
          <OrbitControls 
            enableZoom={false} 
            enableRotate={false} 
            enablePan={false}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}