import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function GridBackground() {
  const gridRef = useRef();
  const grid2Ref = useRef();
  
  // Create grid geometry
  const gridGeometry = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(50, 50, 50, 50);
    return geometry;
  }, []);

  useFrame((state) => {
    if (gridRef.current) {
      // Scrolling grid effect along Z-axis
      gridRef.current.position.z = -10 + (state.clock.elapsedTime * 1.5) % 20;
    }
    
    if (grid2Ref.current) {
      // Second grid for continuous scrolling
      grid2Ref.current.position.z = -30 + (state.clock.elapsedTime * 1.5) % 20;
    }
  });

  return (
    <>
      {/* Primary scrolling grid */}
      <mesh 
        ref={gridRef} 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -8, -10]}
      >
        <primitive object={gridGeometry} />
        <meshBasicMaterial 
          color="#2fffc1"
          wireframe={true}
          transparent={true}
          opacity={0.15}
        />
      </mesh>
      
      {/* Secondary grid for seamless scrolling */}
      <mesh 
        ref={grid2Ref} 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -8, -30]}
      >
        <primitive object={gridGeometry} />
        <meshBasicMaterial 
          color="#a259ff"
          wireframe={true}
          transparent={true}
          opacity={0.1}
        />
      </mesh>
      
      {/* Vertical grid on sides */}
      <mesh 
        rotation={[0, Math.PI / 2, 0]} 
        position={[-15, 0, -5]}
      >
        <planeGeometry args={[30, 30, 20, 20]} />
        <meshBasicMaterial 
          color="#ff2fa0"
          wireframe={true}
          transparent={true}
          opacity={0.08}
        />
      </mesh>
      
      <mesh 
        rotation={[0, -Math.PI / 2, 0]} 
        position={[15, 0, -5]}
      >
        <planeGeometry args={[30, 30, 20, 20]} />
        <meshBasicMaterial 
          color="#2fff4f"
          wireframe={true}
          transparent={true}
          opacity={0.08}
        />
      </mesh>
    </>
  );
}

export default GridBackground;