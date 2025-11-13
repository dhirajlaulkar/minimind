import { useCallback, useEffect, useRef, useState } from 'react'
import { Handle, Position, type NodeProps } from 'reactflow'
import { useMindMapStore } from '../store/useMindMapStore'

export default function NodeEditor({ id, data, selected }: NodeProps) {
  const updateNodeLabel = useMindMapStore((s) => s.updateNodeLabel)
  const [value, setValue] = useState<string>(data?.label ?? '')
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setValue(data?.label ?? '')
  }, [data?.label])

  const commit = useCallback(() => {
    updateNodeLabel(id, value.trim() === '' ? 'Untitled' : value)
  }, [id, updateNodeLabel, value])

  useEffect(() => {
    if (selected) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [selected])

  const widthCh = Math.max(value.length, 6)

  return (
    <div className="inline-flex items-center gap-3 whitespace-nowrap border-4 border-black bg-white px-5 py-3 shadow-[6px_6px_0_#000] uppercase font-black tracking-tightest text-sm">
      <input
        ref={inputRef}
        className="bg-white text-black uppercase font-black tracking-tightest outline-none border-3 border-black px-3 py-2 shadow-[3px_3px_0_#000] focus:border-[4px] focus:shadow-[4px_4px_0_#22D3EE]"
        style={{ width: `${widthCh}ch` }}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            (e.target as HTMLInputElement).blur()
          }
          if (e.key === 'Escape') {
            setValue(data?.label ?? '')
            ;(e.target as HTMLInputElement).blur()
          }
        }}
        aria-label="Node label"
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
