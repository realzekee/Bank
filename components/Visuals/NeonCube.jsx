import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

// NeonCube component with glowing edges
export function NeonCube({ position = [0, 0, 0], color = '#a259ff' }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial 
        color={color}
        wireframe={true}
        transparent={true}
        opacity={0.6}
      />
    </mesh>
  );
}

// WireSphere component with floating animation
export function WireSphere({ position = [0, 0, 0], color = '#2fffc1' }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.15;
      meshRef.current.position.x = position[0] + Math.cos(state.clock.elapsedTime * 0.5) * 2;
      meshRef.current.position.z = position[2] + Math.sin(state.clock.elapsedTime * 0.3) * 1;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.8, 16, 16]} />
      <meshBasicMaterial 
        color={color}
        wireframe={true}
        transparent={true}
        opacity={0.4}
      />
    </mesh>
  );
}

// GridBackground component with scrolling effect
export function GridBackground() {
  const gridRef = useRef();
  
  const gridGeometry = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(40, 40, 40, 40);
    return geometry;
  }, []);

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.z = -5 + (state.clock.elapsedTime * 2) % 10;
    }
  });

  return (
    <mesh ref={gridRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, -5]}>
      <primitive object={gridGeometry} />
      <meshBasicMaterial 
        color="#2fffc1"
        wireframe={true}
        transparent={true}
        opacity={0.2}
      />
    </mesh>
  );
}

// Tetrahedron component with color pulse
export function NeonTetrahedron({ position = [0, 0, 0] }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.4;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      
      // Color pulse effect
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.5 + 0.5;
      meshRef.current.material.opacity = 0.3 + pulse * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <tetrahedronGeometry args={[1]} />
      <meshBasicMaterial 
        color="#ff2fa0"
        wireframe={true}
        transparent={true}
        opacity={0.5}
      />
    </mesh>
  );
}

// Low-poly pyramid with color pulses
export function NeonPyramid({ position = [0, 0, 0] }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      
      // Color cycle through neon colors
      const time = state.clock.elapsedTime;
      const colorIndex = Math.floor(time) % 4;
      const colors = ['#a259ff', '#2fffc1', '#ff2fa0', '#2fff4f'];
      meshRef.current.material.color.set(colors[colorIndex]);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <coneGeometry args={[1, 2, 4]} />
      <meshBasicMaterial 
        wireframe={true}
        transparent={true}
        opacity={0.6}
      />
    </mesh>
  );
}

// Legacy export for backward compatibility
export function GridEffect() {
  return <GridBackground />;
}

export default NeonCube;
