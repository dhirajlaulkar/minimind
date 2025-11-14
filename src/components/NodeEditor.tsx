import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Handle, Position, type NodeProps } from 'reactflow'
import { useMindMapStore, type NodeSize } from '../store/useMindMapStore'

const MIN_WIDTH = 140
const MIN_HEIGHT = 56

const ensureSize = (size?: NodeSize | null): NodeSize => ({
  width: Math.max(MIN_WIDTH, size?.width ?? MIN_WIDTH),
  height: Math.max(MIN_HEIGHT, size?.height ?? MIN_HEIGHT),
})

export default function NodeEditor({ id, data, selected }: NodeProps) {
  const nodeData = (data ?? {}) as { label?: string; size?: NodeSize }
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
    if (selected) {
      textareaRef.current?.focus()
      textareaRef.current?.select()
    }
  }, [selected])

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

  return (
    <div ref={containerRef} className="mindmap-node">
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
            ;(e.target as HTMLTextAreaElement).blur()
          }
          if (e.key === 'Escape') {
            setValue(nodeData.label ?? '')
            ;(e.target as HTMLTextAreaElement).blur()
          }
        }}
        aria-label="Node label"
        spellCheck={false}
      />
      <Handle id="t-target" type="target" position={Position.Top} />
      <Handle id="b-source" type="source" position={Position.Bottom} />
      {/* Left side: allow both start (source) and end (target) connections, offset so both are usable */}
      <Handle
        id="l-target"
        type="target"
        position={Position.Left}
        style={{ left: -14, top: '40%' }}
      />
      <Handle
        id="l-source"
        type="source"
        position={Position.Left}
        style={{ left: -14, top: '60%' }}
      />
      {/* Right side: allow both start (source) and end (target) connections */}
      <Handle
        id="r-source"
        type="source"
        position={Position.Right}
        style={{ right: -14, top: '40%' }}
      />
      <Handle
        id="r-target"
        type="target"
        position={Position.Right}
        style={{ right: -14, top: '60%' }}
      />
    </div>
  )
}
