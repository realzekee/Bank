import React from 'react';
import { Canvas } from '@react-three/fiber';
import { NeonCube, GridEffect } from './NeonCube.jsx';

export default function CyberpunkVisuals() {
  return (
    <div className="fixed inset-0 w-full h-full z-0">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <ambientLight intensity={0.7} />
        <NeonCube position={[-2, 0, 0]} color="#a259ff" />
        <NeonCube position={[2, 1, -1]} color="#2fffc1" />
        <GridEffect />
        {/* Add more shapes and effects here */}
      </Canvas>
    </div>
  );
}
