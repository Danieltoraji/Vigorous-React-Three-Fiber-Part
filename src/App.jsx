import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from 'three'

function App() {
  return(
    <Canvas camera={{position: [3,3,3]}}>
      <OrbitControls />
      <mesh position-x={-0.9}>
        <boxGeometry />
        <meshStandardMaterial color={0x00ff00} side={THREE.FrontSide} />
      </mesh>
       <mesh position-x={-0.9} position-z={-2}>
        <boxGeometry />
        <meshStandardMaterial color={0x00ff00} side={THREE.BackSide} />
      </mesh>
      <mesh position-x={0.6} position-z={1}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color={0xff0000} />
      </mesh>
      <ambientLight intensity={0.5} />
      <directionalLight position={[1, 1, 1]} intensity={0.5} />
      <directionalLight position={[0, 0, 2]} intensity={0.5} />
    </Canvas>
  )
}

export default App
