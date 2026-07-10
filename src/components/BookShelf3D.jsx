import { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import Book3D from './Book3D'

const SPACING = 1.5 // distance between book centers on the shelf

/**
 * The moving shelf group. Handles auto-scroll, drag, hover depth rotation.
 * Lives inside <Canvas>.
 */
function ShelfRow({ books, pausedRef, dragRef, onOpenBook }) {
  const group = useRef(null)
  const [hovered, setHovered] = useState(null)
  const { viewport } = useThree()

  // Duplicate the book set once so the row can loop seamlessly.
  const row = useMemo(() => [...books, ...books], [books])
  const totalLen = books.length * SPACING

  useFrame((_, delta) => {
    if (!group.current) return
    // Auto-scroll slowly leftward unless paused or dragging
    if (!pausedRef.current && Math.abs(dragRef.current.velocity) < 0.001) {
      group.current.position.x -= delta * 0.35
    }
    // Apply drag velocity (with decay)
    group.current.position.x -= dragRef.current.velocity
    dragRef.current.velocity *= 0.9

    // Wrap position so the row loops infinitely
    if (group.current.position.x < -totalLen) {
      group.current.position.x += totalLen
    } else if (group.current.position.x > 0) {
      group.current.position.x -= totalLen
    }
  })

  return (
    <group ref={group}>
      {row.map((book, i) => {
        const x = i * SPACING
        return (
          <group key={i} position={[x, 0, 0]}>
            <DepthAwareBook
              book={book}
              isHovered={hovered === i}
              anyHovered={hovered !== null}
              onPointerOver={() => setHovered(i)}
              onPointerOut={() => setHovered((h) => (h === i ? null : h))}
              onClick={() => onOpenBook(book)}
            />
          </group>
        )
      })}
    </group>
  )
}

/**
 * A book that rotates based on its distance from screen center (cinema-poster depth).
 */
function DepthAwareBook({ book, isHovered, anyHovered, onPointerOver, onPointerOut, onClick }) {
  const ref = useRef(null)
  const { camera } = useThree()

  useFrame(() => {
    if (!ref.current) return
    // World position of this book's group → project to screen X
    const worldPos = new THREE.Vector3()
    ref.current.getWorldPosition(worldPos)
    // distance from camera center axis (x=0 in world)
    const dist = worldPos.x
    // Map distance to a rotation: center = 0deg, edges up to ~25deg
    const maxDist = 6
    const ratio = Math.min(Math.abs(dist) / maxDist, 1)
    const baseRot = Math.sign(dist) * ratio * 0.45 // ~25deg max
    // Hover overrides rotation toward viewer (handled inside Book3D too, but we set base here)
    ref.current.rotation.y = baseRot
  })

  return (
    <group ref={ref}>
      <Book3D
        book={book}
        hover={isHovered}
        dim={anyHovered && !isHovered ? 1 : 0}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        onClick={onClick}
      />
    </group>
  )
}

export default function BookShelf3D({ books, onOpenBook }) {
  const pausedRef = useRef(false)
  const dragRef = useRef({ active: false, lastX: 0, velocity: 0 })

  function onPointerDown(e) {
    pausedRef.current = true
    dragRef.current.active = true
    dragRef.current.lastX = e.clientX
  }
  function onPointerMove(e) {
    if (!dragRef.current.active) return
    const dx = e.clientX - dragRef.current.lastX
    dragRef.current.lastX = e.clientX
    // scale drag to world units (approx)
    dragRef.current.velocity = -dx * 0.01
  }
  function onPointerUp() {
    dragRef.current.active = false
    pausedRef.current = false
  }

  return (
    <div
      className="bookshelf-canvas-wrap"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onPointerOver={() => (pausedRef.current = true)}
      onPointerOut={() => {
        if (!dragRef.current.active) pausedRef.current = false
      }}
    >
      <Canvas dpr={[1, 2]} gl={{ alpha: true, antialias: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={45} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 5, 4]} intensity={1.2} castShadow />
        <directionalLight position={[-4, 2, -2]} intensity={0.3} color="#88aaff" />
        <Environment preset="city" />
        <ShelfRow
          books={books}
          pausedRef={pausedRef}
          dragRef={dragRef}
          onOpenBook={onOpenBook}
        />
        <ContactShadows
          position={[0, -1.2, 0]}
          opacity={0.5}
          scale={20}
          blur={2.5}
          far={4}
        />
      </Canvas>
    </div>
  )
}
