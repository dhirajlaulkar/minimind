import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Handle, Position, type NodeProps } from 'reactflow'
import { useMindMapStore, type NodeSize } from '../store/useMindMapStore'
import clsx from 'clsx'
import { Lock } from 'lucide-react'

const MIN_WIDTH = 140
const MIN_HEIGHT = 56

const ensureSize = (size?: NodeSize | null): NodeSize => ({
  width: Math.max(MIN_WIDTH, size?.width ?? MIN_WIDTH),
  height: Math.max(MIN_HEIGHT, size?.height ?? MIN_HEIGHT),
})

export default function NodeEditor({ id, data, selected }: NodeProps) {
  const nodeData = (data ?? {}) as {
    label?: string
    size?: NodeSize
    color?: string
    shape?: 'rectangle' | 'circle' | 'diamond' | 'hexagon'
    locked?: boolean
  }

  const updateNodeLabel = useMindMapStore((s) => s.updateNodeLabel)
  const setNodeSize = useMindMapStore((s) => s.setNodeSize)
  const [value, setValue] = useState<string>(nodeData.label ?? '')
  const containerRef = useRef<HTMLDivElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const latestSizeRef = useRef<NodeSize>(ensureSize(nodeData.size))
  const pointerActiveRef = useRef(false)

  useEffect(() => {
    setValue(nodeData.label ?? '')
  }, [nodeData.label])

  const applySize = useCallback((size: NodeSize) => {
    const node = containerRef.current
    if (!node) return
    node.style.width = `${size.width}px`
    node.style.height = `${size.height}px`
  }, [])

  useLayoutEffect(() => {
    const nextSize = ensureSize(nodeData.size)
    latestSizeRef.current = nextSize
    applySize(nextSize)
  }, [nodeData.size?.width, nodeData.size?.height, applySize])

  const commitLabel = useCallback(() => {
    updateNodeLabel(id, value.trim() === '' ? 'Untitled' : value)
  }, [id, updateNodeLabel, value])

  const commitSize = useCallback(() => {
    setNodeSize(id, latestSizeRef.current)
  }, [id, setNodeSize])

  useEffect(() => {
    if (selected && !nodeData.locked) {
      // Only focus if not locked? Or maybe always focus but check readOnly?
      // Let's allow editing label even if locked for now, unless we want strict locking.
      // User requested "Lock node position", usually implies content is still editable or maybe not.
      // For now, let's allow editing.
      textareaRef.current?.focus()
      // textareaRef.current?.select() // Auto-select might be annoying if just clicking to view props
    }
  }, [selected, nodeData.locked])

  useEffect(() => {
    const node = containerRef.current
    if (!node) return

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      latestSizeRef.current = ensureSize({ width, height })
    })
    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const node = containerRef.current
    if (!node) return

    const handlePointerDown = () => {
      pointerActiveRef.current = true
    }

    const handlePointerUp = () => {
      if (!pointerActiveRef.current) return
      pointerActiveRef.current = false
      commitSize()
    }

    node.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointerup', handlePointerUp)

    return () => {
      node.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [commitSize])

  // Shape styles
  const shape = nodeData.shape || 'rectangle'
  const isDiamond = shape === 'diamond'
  const isCircle = shape === 'circle'
  const isHexagon = shape === 'hexagon'

  // Dynamic classes
  const containerClasses = clsx(
    "relative flex items-stretch transition-all duration-200",
    // Base shape styles
    !isDiamond && !isCircle && !isHexagon && "rounded-xl border",
    isCircle && "rounded-full border aspect-square justify-center items-center text-center",
    // Selection & Locking
    selected && "ring-2 ring-blue-500 ring-offset-2",
    nodeData.locked && "opacity-90",
    // Shadow
    "shadow-sm hover:shadow-md",
    // Custom Color or Default
    !nodeData.color && "bg-white border-slate-300",
  )

  // For diamond/hexagon, we might need clip-path or SVG wrapper if we want true shapes with borders.
  // CSS borders on clip-path are tricky.
  // For Phase 1, let's stick to simple CSS shapes. 
  // Diamond: rotate 45deg wrapper, rotate content -45deg? Or just clip-path.
  // Let's use a simpler approach for now: Border Radius for Circle/Rect. 
  // For Diamond/Hexagon, let's use SVG background or just CSS clip-path (but border is hard).
  // Alternative: Use a pseudo-element for the shape background.

  // Let's try a cleaner approach for shapes:
  // We will apply the background color and border to the div.

  const style: React.CSSProperties = {
    backgroundColor: nodeData.color || '#ffffff',
    borderColor: nodeData.color ? '#00000020' : undefined, // Slight border for colored nodes
  }

  if (isDiamond) {
    style.transform = 'rotate(45deg)'
  }

  return (
    <div ref={containerRef} className={containerClasses} style={style}>
      {/* Lock Indicator */}
      {nodeData.locked && (
        <div className={clsx(
          "absolute -top-2 -right-2 z-10 bg-white rounded-full p-1 shadow border border-slate-200",
          isDiamond && "-rotate-45" // Counter rotate icon
        )}>
          <Lock size={12} className="text-red-500" />
        </div>
      )}

      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => {
          commitLabel()
          commitSize()
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
              ; (e.target as HTMLTextAreaElement).blur()
          }
          if (e.key === 'Escape') {
            setValue(nodeData.label ?? '')
              ; (e.target as HTMLTextAreaElement).blur()
          }
        }}
        className={clsx(
          "w-full h-full bg-transparent border-none resize-none outline-none p-3 text-center font-medium text-slate-800 leading-tight overflow-hidden",
          isDiamond && "-rotate-45 flex items-center justify-center", // Counter rotate text
          isCircle && "flex items-center justify-center"
        )}
        aria-label="Node label"
        spellCheck={false}
        style={{ minHeight: '100%' }}
      />

      {/* Handles - Position them smartly based on shape? 
          For now, standard handles are fine, maybe adjust offset for Diamond.
      */}

      <Handle id="t-target" type="target" position={Position.Top} className={clsx(isDiamond && "-translate-y-4")} />
      <Handle id="b-source" type="source" position={Position.Bottom} className={clsx(isDiamond && "translate-y-4")} />
      <Handle id="l-target" type="target" position={Position.Left} className={clsx(isDiamond && "-translate-x-4")} />
      <Handle id="r-source" type="source" position={Position.Right} className={clsx(isDiamond && "translate-x-4")} />
    </div>
  )
}
