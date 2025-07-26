import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export function NeonCube({ position, color }) {
  const mesh = useRef();
  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x += 0.01;
      mesh.current.rotation.y += 0.01;
    }
  });
  return (
    <mesh position={position} ref={mesh}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
    </mesh>
  );
}

export function GridEffect() {
  // Placeholder for grid/holographic effect
  return null;
}
