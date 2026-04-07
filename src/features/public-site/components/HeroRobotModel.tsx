import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, useAnimations, Center } from '@react-three/drei'
import { Suspense, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

function Model() {
  const group = useRef<THREE.Group | null>(null)
  const { scene, animations } = useGLTF('/model/robot_playground.glb')
  const { actions, names } = useAnimations(animations, group)

  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (!names.length) {
      console.log('No animations found in model')
      return
    }

    console.log('Available animations:', names)

    const action = actions[names[0]]
    action?.reset().fadeIn(0.5).play()

    return () => {
      action?.fadeOut(0.5)
    }
  }, [actions, names])

  return (
    <group ref={group}>
      <Center>
        <primitive
          object={scene}
          scale={isMobile ? 0.95 : 1.2}
          position={isMobile ? [0, -0.2, 0] : [0, 0, 0]}
        />
      </Center>
    </group>
  )
}

useGLTF.preload('/model/robot_playground.glb')

export function HeroRobotModel() {
  return (
    <div className="w-full h-[320px] sm:h-[420px] md:h-[520px] lg:h-[620px]">
      <Canvas camera={{ position: [0, 1.5, 6], fov: 45 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 5, 5]} intensity={2} />

        <Suspense fallback={null}>
          <Center>
            <Model />
          </Center>
        </Suspense>

        <OrbitControls enablePan={false} enableZoom={false} />
      </Canvas>
    </div>
  )
}