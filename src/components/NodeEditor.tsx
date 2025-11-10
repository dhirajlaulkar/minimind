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

  return (
    <div className="rounded-lg bg-white shadow-soft border border-neutral-200 px-3 py-2 min-w-40">
      <input
        ref={inputRef}
        className="w-full bg-transparent outline-none text-sm"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            (e.target as HTMLInputElement).blur()
          }
        }}
        aria-label="Node label"
      />
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-neutral-400" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-neutral-400" />
    </div>
  )
}


