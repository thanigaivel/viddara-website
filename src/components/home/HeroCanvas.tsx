'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  const smallPointsRef = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const count = 280;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 28;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      sizes[i] = Math.random() * 0.04 + 0.02;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  const smallGeometry = useMemo(() => {
    const count = 120;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 32;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.015;
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.006) * 0.06;
    if (smallPointsRef.current) {
      smallPointsRef.current.rotation.y = -state.clock.elapsedTime * 0.008;
      smallPointsRef.current.rotation.z = state.clock.elapsedTime * 0.004;
    }
  });

  return (
    <>
      <points ref={pointsRef} geometry={geometry}>
        <pointsMaterial size={0.055} color="#C8A54A" transparent opacity={0.45} sizeAttenuation />
      </points>
      <points ref={smallPointsRef} geometry={smallGeometry}>
        <pointsMaterial size={0.025} color="#8AA6D6" transparent opacity={0.3} sizeAttenuation />
      </points>
    </>
  );
}

function WireframeGem({ position, scale, speed }: { position: [number, number, number]; scale: number; speed: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.7;
    meshRef.current.rotation.y = state.clock.elapsedTime * speed;
    meshRef.current.rotation.z = state.clock.elapsedTime * speed * 0.3;
    // Subtle breathing scale
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 0.8 + position[0]) * 0.05;
    meshRef.current.scale.setScalar(scale * pulse);
  });

  return (
    <mesh ref={meshRef} position={position}>
      <octahedronGeometry args={[1.8, 0]} />
      <meshStandardMaterial color="#C8A54A" wireframe transparent opacity={0.15} />
    </mesh>
  );
}

function WireframeRing({ position, speed, radius }: { position: [number, number, number]; speed: number; radius: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.z = state.clock.elapsedTime * speed;
    meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.4;
    meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.5;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <torusGeometry args={[radius, 0.018, 8, 60]} />
      <meshStandardMaterial color="#8AA6D6" transparent opacity={0.12} />
    </mesh>
  );
}

function FloatingCrystal() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.4;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.06;
  });

  return (
    <group ref={groupRef} position={[0, 0, -5]}>
      <mesh>
        <icosahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial color="#163768" wireframe transparent opacity={0.08} />
      </mesh>
    </group>
  );
}

export default function HeroCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 58 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.2} />
      <pointLight position={[8, 8, 8]} intensity={1.5} color="#C8A54A" />
      <pointLight position={[-8, -4, 4]} intensity={0.6} color="#4A7AC8" />
      <pointLight position={[0, 6, -4]} intensity={0.4} color="#ffffff" />
      <ParticleField />
      <WireframeGem position={[4.5, 0.5, -3]} scale={1} speed={0.12} />
      <WireframeGem position={[-4, -1.5, -4]} scale={0.65} speed={0.08} />
      <WireframeRing position={[-5, -1, -4]} speed={0.05} radius={2} />
      <WireframeRing position={[5, 2, -6]} speed={0.03} radius={3} />
      <FloatingCrystal />
    </Canvas>
  );
}
