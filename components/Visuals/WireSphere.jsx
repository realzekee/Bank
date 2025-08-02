import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export function WireSphere({ position = [0, 0, 0], color = '#2fffc1', radius = 1 }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      
      // Floating animation
      meshRef.current.position.x = position[0] + Math.cos(state.clock.elapsedTime * 0.5) * 2;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3) * 1;
      meshRef.current.position.z = position[2] + Math.sin(state.clock.elapsedTime * 0.4) * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[radius, 16, 16]} />
      <meshBasicMaterial 
        color={color}
        wireframe={true}
        transparent={true}
        opacity={0.4}
      />
    </mesh>
  );
}

export default WireSphere;