import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from 'three'
import React, { useMemo, useState, useCallback } from 'react'
import { Selection, EffectComposer, Outline, Select } from '@react-three/postprocessing'

// 3D对象组件 - 添加点击功能
const SceneObject = ({ object, isSelected, onSelect }) => {
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

  const handleClick = useCallback((event) => {
    event.stopPropagation();
    onSelect(object.id);
  }, [object.id, onSelect]);

  return (
    <mesh
      position={[object.position.x, object.position.y, object.position.z]}
      rotation={[0, 0, 0]}
      onClick={handleClick}
      onPointerOver={(e) => {
        document.body.style.cursor = 'pointer';
        e.stopPropagation();
      }}
      onPointerOut={(e) => {
        document.body.style.cursor = 'auto';
        e.stopPropagation();
      }}
    >
      {geometry}
      <meshStandardMaterial
        color={object.color}
      />
    </mesh>
  );
};


function ModelPage({ objects = [] }) {
  const [selectedObjectId, setSelectedObjectId] = useState(null);

  const handleObjectSelect = useCallback((objectId) => {
    setSelectedObjectId(objectId);
    console.log('点击了对象ID:', objectId);
  }, [selectedObjectId]);

  // 构建选中对象数组用于Outline效果
  const selectedObjects = [];

  // 收集所有可选中的对象
  const allSelectableObjects = [
    ...objects,

  ];

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#1a1a1a'
    }}>
      <Canvas
        style={{ width: '100%', height: '100%' }}
        onPointerMissed={() => setSelectedObjectId(null)} // 点击空白处取消选中
      >
        <perspectiveCamera position={[3, 3, 3]} near={0.1} far={100} />
        <OrbitControls />

        {/* 设置场景背景 */}
        <color attach="background" args={['#140076']} />

        <group>
          {/* 渲染动态对象 - 带点击功能 */}
          {objects.map((object) => (
            <SceneObject
              key={object.id}
              object={object}
              isSelected={selectedObjectId === object.id}
              onSelect={handleObjectSelect}
            />
          ))}



          {/* 包裹 Selection 组件，可以理解为一个大选区，存放着准备操作的对象 */}
          <Selection>
            {/* 后处理合成器，它先画出原始场景，然后交由内部的"效果器"进行加工 */}
            <EffectComposer multisampling={0} autoClear={false}>
              {/* 描边效果器配置 */}
              <Outline
                selectionLayer={10}
                edgeStrength={20}  // 降低edgeStrength值避免边缘破碎
                visibleEdgeColor={0xffff00}
                blur
                blurPassRadius={20}  // 降低模糊半径
                blurPassIterations={1}  // 减少迭代次数
                blurPassDepthThreshold={0.01}
                blurPassDepthAwareUpsampling
              />
            </EffectComposer>

            {objects.map(obj => (
              <Select key={obj.id} enabled={obj.id === selectedObjectId}>
                <SceneObject object={obj} />
              </Select>
            ))}
          </Selection>



          <ambientLight intensity={0.5} />
          <directionalLight position={[1, 1, 1]} intensity={0.5} />
          <directionalLight position={[0, 0, 2]} intensity={0.5} />
        </group>
      </Canvas>
    </div>
  )
}

export default ModelPage