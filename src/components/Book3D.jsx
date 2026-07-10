import { useRef, useMemo } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three'
import * as THREE from 'three'

/**
 * A single hardcover book rendered in 3D.
 *
 * Layout (local space, book faces +Z toward camera):
 *   - Cover   : front face, sized W x H, with the cover texture
 *   - Spine   : left face (-X), dark colored, full thickness
 *   - Pages   : right face (+X) and top/bottom, light beige slabs
 *   - Back    : rear face (-Z), plain dark
 *
 * Props:
 *   book       — book data { cover, spineColor, ... }
 *   spread     — current animated 0..1 state for hover emphasis (lerped)
 *   dimmed     — whether other books should fade (0..1)
 *   onPointerOver / onPointerOut / onClick
 */
const W = 1.0 // cover width
const H = 1.4 // cover height
const T = 0.22 // book thickness (spine depth)

export default function Book3D({
  book,
  hover = false,
  dim = 0,
  onPointerOver,
  onPointerOut,
  onClick,
}) {
  const group = useRef(null)
  const coverTex = useLoader(TextureLoader, book.cover)

  useFrame(() => {
    if (!group.current) return
    // Target rotation: hovered book turns ~35deg toward viewer
    const targetRot = hover ? -0.6 : 0
    const targetScale = hover ? 1.1 : 1
    const targetZ = hover ? 0.25 : 0
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRot, 0.12)
    const s = THREE.MathUtils.lerp(group.current.scale.x, targetScale, 0.12)
    group.current.scale.setScalar(s)
    group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, targetZ, 0.12)
    // dim effect via material opacity is handled on each mesh material
  })

  // Materials
  const coverMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: coverTex,
        roughness: 0.55,
        metalness: 0.05,
        transparent: true,
      }),
    [coverTex]
  )
  const spineMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: book.spineColor || '#141414',
        roughness: 0.7,
        transparent: true,
      }),
    [book.spineColor]
  )
  const pageMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#e8e4dc',
        roughness: 0.95,
        transparent: true,
      }),
    []
  )
  const backMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1a1a1a',
        roughness: 0.7,
        transparent: true,
      }),
    []
  )

  // Apply dim opacity to all materials each render (cheap)
  const opacity = 1 - dim * 0.5
  ;[coverMat, spineMat, pageMat, backMat].forEach((m) => (m.opacity = opacity))

  return (
    <group
      ref={group}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onClick={onClick}
    >
      {/* Cover (front face +Z) */}
      <mesh position={[0, 0, T / 2]} material={coverMat}>
        <planeGeometry args={[W, H]} />
      </mesh>

      {/* Back cover (-Z) */}
      <mesh position={[0, 0, -T / 2]} material={backMat}>
        <planeGeometry args={[W, H]} />
      </mesh>

      {/* Spine (left -X side) */}
      <mesh position={[-W / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={spineMat}>
        <planeGeometry args={[T, H]} />
      </mesh>

      {/* Pages (right +X side) — slightly inset, lighter */}
      <mesh position={[W / 2 - 0.005, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={pageMat}>
        <planeGeometry args={[T - 0.01, H - 0.02]} />
      </mesh>

      {/* Top edge pages */}
      <mesh position={[0, H / 2, 0]} rotation={[-Math.PI / 2, 0, 0]} material={pageMat}>
        <planeGeometry args={[W - 0.01, T - 0.01]} />
      </mesh>

      {/* Bottom edge pages */}
      <mesh position={[0, -H / 2, 0]} rotation={[Math.PI / 2, 0, 0]} material={pageMat}>
        <planeGeometry args={[W - 0.01, T - 0.01]} />
      </mesh>

      {/* A thin solid block for thickness shadow (invisible geometry to catch light) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[W, H, T]} />
        <meshStandardMaterial color="#0a0a0a" roughness={1} transparent opacity={0} />
      </mesh>
    </group>
  )
}
