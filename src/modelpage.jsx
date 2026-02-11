import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from 'three'
import React, { useMemo } from 'react'

// 3D对象组件
const SceneObject = ({ object }) => {
  const geometry = useMemo(() => {
    switch (object.type) {
      case 'sphere':
        return <sphereGeometry args={[object.radius, 32, 32]} />;
      case 'box':
        return <boxGeometry args={[object.width, object.height, object.depth]} />;
      case 'cylinder':
        return <cylinderGeometry args={[
          object.radiusTop,
          object.radiusBottom,
          object.height,
          object.radialSegments
        ]} />;
      default:
        return <boxGeometry />;
    }
  }, [object]);

  return (
    <mesh
      position={[object.position.x, object.position.y, object.position.z]}
      rotation={[0, 0, 0]}
    >
      {geometry}
      <meshStandardMaterial color={object.color} />
    </mesh>
  );
};

function ModelPage({ objects = [] }) {
  return (
    <Canvas style={{ width: '100%', height: '100%' }}>
      <perspectiveCamera position={[3, 3, 3]} near={0.1} far={100} />
      <OrbitControls />
      <group>
        {/* 渲染动态对象 */}
        {objects.map((object) => (
          <SceneObject key={object.id} object={object} />
        ))}

        {/* 原有的静态对象作为示例 */}
        <mesh position={[-3, 2, 5]} scale={[2, 2, 2]} rotation={[THREE.MathUtils.degToRad(45), Math.PI / 4, 0]}>
          <boxGeometry />
          <meshStandardMaterial color={0x00ff00} />
        </mesh>
        <mesh position-x={-0.9} position-z={-2} scale={[0.5, 0.5, 4]}>
          <boxGeometry />
          <meshStandardMaterial color={0x00ff00} />
        </mesh>
        <mesh position-x={0.6} position-z={1} scale={[1, 1, 1]} >
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color={0xff0000} />
        </mesh>
        <ambientLight intensity={0.5} />
        <directionalLight position={[1, 1, 1]} intensity={0.5} />
        <directionalLight position={[0, 0, 2]} intensity={0.5} />
      </group>
    </Canvas>
  )
}

export default ModelPage