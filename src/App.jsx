import { Canvas } from "@react-three/fiber"

function App() {
  return(
    <Canvas>
      <mesh>
        <boxGeometry />
        <meshNormalMaterial />
      </mesh>
    </Canvas>
  )
}

export default App
