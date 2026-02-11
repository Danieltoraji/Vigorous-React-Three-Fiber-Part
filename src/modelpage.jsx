import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from 'three'
import React, { useMemo } from 'react'
import { Selection, Select, EffectComposer, Outline } from '@react-three/postprocessing'

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
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#1a1a1a'
    }}>
      <Canvas
        style={{ width: '100%', height: '100%' }}
      >
        <perspectiveCamera position={[3, 3, 3]} near={0.1} far={100} />
        <OrbitControls />

        {/* 设置场景背景 */}
        <color attach="background" args={['#140076']} />

        <group>
          {/* 渲染动态对象 */}
          {objects.map((object) => (
            <SceneObject key={object.id} object={object} />
          ))}

          {/* 包裹 Selection 组件，可以理解为一个大选区，存放着准备操作的对象 */}
          <Selection>
            {/* 后处理合成器，它先画出原始场景，然后交由内部的“效果器”进行加工 */}
            <EffectComposer multisampling={0} autoClear={false}>
              {/* 描边效果器配置 */}
              <Outline
                selection={[...objects]}// 指定要选中的对象数组
                selectionLayer={10}     // 指定一个特定的图层编号，只对其后处理
                edgeStrength={400}
                visibleEdgeColor={0xffff00}// 指定描边颜色
                blur
                blurPassRadius={50}
                blurPassIterations={2}
                blurPassDepthThreshold={0.01}
                blurPassDepthAwareUpsampling
              />

              {/* 此处选择了一个物体作为示例 */}
              <Select enabled={true}>
                <mesh position-x={0.6} position-z={1} scale={[1, 1, 1]}>
                  <sphereGeometry args={[1, 32, 32]} />
                  <meshStandardMaterial color={0xff0000} />
                </mesh>
              </Select>

            </EffectComposer>
          </Selection>

          {/* 原有的静态对象作为示例 */}
          <mesh position={[-3, 2, 5]} scale={[2, 2, 2]} rotation={[THREE.MathUtils.degToRad(45), Math.PI / 4, 0]}>
            <boxGeometry />
            <meshStandardMaterial color={0x00ff00} />
          </mesh>
          <mesh position-x={-0.9} position-z={-2} scale={[0.5, 0.5, 4]}>
            <boxGeometry />
            <meshStandardMaterial color={0x00ff00} />
          </mesh>

          <ambientLight intensity={0.5} />
          <directionalLight position={[1, 1, 1]} intensity={0.5} />
          <directionalLight position={[0, 0, 2]} intensity={0.5} />
        </group>
      </Canvas>
    </div>
  )
}

export default ModelPage