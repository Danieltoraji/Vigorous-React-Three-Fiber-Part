import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from 'three'

function ModelPage() {
  return(
    <Canvas style={{ width: '100%', height: '75vh' }}>
      <perspectiveCamera position={[3,3,3]} near={0.1} far={100} />
      <OrbitControls />
      <group>
      <mesh position={[-3,2,5]} scale = {[2,2,2]} rotation={[THREE.MathUtils.degToRad(45),Math.PI/4,0]}>
        <boxGeometry />
        <meshStandardMaterial color={0x00ff00} />
      </mesh>
       <mesh position-x={-0.9} position-z={-2} scale={[0.5,0.5,4]}>
        <boxGeometry />
        <meshStandardMaterial color={0x00ff00} />
      </mesh>
      <mesh position-x={0.6} position-z={1} scale={[1,1,1]} >
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