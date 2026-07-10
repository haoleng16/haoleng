import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { PerspectiveCamera, Environment } from '@react-three/drei'
import { TextureLoader } from 'three'
import * as THREE from 'three'

const W = 2.0
const H = 2.8
const T = 0.4

/**
 * The opening book: cover swings open on the hinge (left edge / spine).
 */
function OpeningBook({ cover, openProgress }) {
  const coverTex = useLoader(TextureLoader, cover)
  const flap = useRef(null)

  useFrame(() => {
    if (!flap.current) return
    // openProgress 0..1 → cover rotates 0..170deg around the spine (left edge)
    const target = openProgress.current * (Math.PI * 0.94) // ~170deg
    flap.current.rotation.y = THREE.MathUtils.lerp(flap.current.rotation.y, target, 0.15)
  })

  return (
    <group position={[0, 0, 0]}>
      {/* Base (pages block) — sits flat */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[W, H, T]} />
        <meshStandardMaterial color="#f0ece4" roughness={0.95} />
      </mesh>

      {/* First page hint on top */}
      <mesh position={[0, 0.001, T / 2 + 0.001]}>
        <planeGeometry args={[W - 0.04, H - 0.04]} />
        <meshStandardMaterial color="#fafaf7" roughness={1} />
      </mesh>

      {/* Hinged cover flap — pivots at the left edge (spine at -W/2) */}
      <group ref={flap} position={[-W / 2, 0, T / 2]}>
        <mesh position={[W / 2, 0, 0.02]}>
          <planeGeometry args={[W, H]} />
          <meshStandardMaterial
            map={coverTex}
            roughness={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  )
}

export default function BookReader({ book, onClose }) {
  const [phase, setPhase] = useState('opening') // 'opening' → 'reading'
  const openProgress = useRef(0)
  const startTime = useRef(null)

  // Drive the open animation, then switch to reading (PDF) phase.
  useEffect(() => {
    if (phase !== 'opening') return
    const t = setTimeout(() => {
      openProgress.current = 1
    }, 50)
    const done = setTimeout(() => setPhase('reading'), 1100)
    return () => {
      clearTimeout(t)
      clearTimeout(done)
    }
  }, [phase])

  return (
    <div className="book-reader-overlay">
      <button className="book-reader-close" onClick={onClose} aria-label="关闭阅读">
        ✕
      </button>

      {phase === 'opening' ? (
        <Canvas dpr={[1, 2]} gl={{ alpha: true, antialias: true }}>
          <PerspectiveCamera makeDefault position={[0, 0.5, 5.5]} fov={40} />
          <ambientLight intensity={0.6} />
          <directionalLight position={[2, 4, 5]} intensity={1.4} />
          <directionalLight position={[-3, 1, 2]} intensity={0.4} color="#aaccff" />
          <Environment preset="city" />
          <OpeningBook cover={book.cover} openProgress={openProgress} />
        </Canvas>
      ) : (
        <div className="book-pdf-frame">
          <iframe title={book.title} src={book.pdfPath} />
        </div>
      )}

      {phase === 'reading' && (
        <div className="book-reader-title">{book.title}</div>
      )}
    </div>
  )
}
